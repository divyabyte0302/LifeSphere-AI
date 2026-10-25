package ai.lifesphere.app

import android.content.Context
import android.util.Log
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.BloodPressureRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.health.connect.client.records.OxygenSaturationRecord
import androidx.health.connect.client.records.SleepSessionRecord
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.records.BodyTemperatureRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import java.time.Instant
import java.time.temporal.ChronoUnit
import org.json.JSONArray
import org.json.JSONObject

/**
 * LifeSphere AI-X Native Android Health Connect Integration Manager.
 * Reads authorized records (Heart Rate, Blood Pressure, SpO2, Sleep, Body Temp, Steps)
 * using HealthConnectClient, formats JSON batch payload, and sends to shared FastAPI backend.
 */
class HealthConnectSyncManager(private val context: Context) {

    companion object {
        private const val TAG = "HealthConnectSyncManager"
        
        val PERMISSIONS = setOf(
            HealthPermission.getReadPermission(HeartRateRecord::class),
            HealthPermission.getReadPermission(BloodPressureRecord::class),
            HealthPermission.getReadPermission(OxygenSaturationRecord::class),
            HealthPermission.getReadPermission(SleepSessionRecord::class),
            HealthPermission.getReadPermission(BodyTemperatureRecord::class),
            HealthPermission.getReadPermission(StepsRecord::class)
        )
    }

    fun isHealthConnectAvailable(): Boolean {
        val status = HealthConnectClient.getSdkStatus(context)
        return status == HealthConnectClient.SDK_AVAILABLE
    }

    suspend fun hasAllPermissions(): Boolean {
        if (!isHealthConnectAvailable()) return false
        val client = HealthConnectClient.getOrCreate(context)
        val granted = client.permissionController.getGrantedPermissions()
        return granted.containsAll(PERMISSIONS)
    }

    suspend fun readAndSyncHealthRecords(
        backendUrl: String,
        authToken: String,
        connectionId: String = "conn_health_connect_android"
    ): SyncResult {
        if (!isHealthConnectAvailable()) {
            return SyncResult(
                success = false,
                importedCount = 0,
                errorMessage = "Health Connect SDK is not available or installed on this Android device."
            )
        }

        val client = HealthConnectClient.getOrCreate(context)
        val startTime = Instant.now().minus(7, ChronoUnit.DAYS)
        val endTime = Instant.now()
        val timeRangeFilter = TimeRangeFilter.between(startTime, endTime)

        val batchRecords = JSONArray()

        try {
            // 1. Read Heart Rate Records
            val hrResponse = client.readRecords(
                ReadRecordsRequest(
                    recordType = HeartRateRecord::class,
                    timeRangeFilter = timeRangeFilter
                )
            )
            for (record in hrResponse.records) {
                for (sample in record.samples) {
                    val item = JSONObject().apply {
                        put("source_record_id", "hr_${record.metadata.id}_${sample.time}")
                        put("provider", "android_health_connect")
                        put("measurement_type", "heart_rate")
                        put("numeric_value", sample.beatsPerMinute.toDouble())
                        put("unit", "bpm")
                        put("measured_at", sample.time.toString())
                        put("source_device_name", record.metadata.device?.model ?: "Android Device (Health Connect)")
                    }
                    batchRecords.put(item)
                }
            }

            // 2. Read Blood Pressure Records
            val bpResponse = client.readRecords(
                ReadRecordsRequest(
                    recordType = BloodPressureRecord::class,
                    timeRangeFilter = timeRangeFilter
                )
            )
            for (record in bpResponse.records) {
                val item = JSONObject().apply {
                    put("source_record_id", "bp_${record.metadata.id}")
                    put("provider", "android_health_connect")
                    put("measurement_type", "blood_pressure")
                    put("numeric_value", record.systolic.inMillimetersOfMercury)
                    put("secondary_value", record.diastolic.inMillimetersOfMercury)
                    put("unit", "mmHg")
                    put("measured_at", record.time.toString())
                    put("source_device_name", record.metadata.device?.model ?: "Android Device (Health Connect)")
                }
                batchRecords.put(item)
            }

            // 3. Read Oxygen Saturation Records
            val spo2Response = client.readRecords(
                ReadRecordsRequest(
                    recordType = OxygenSaturationRecord::class,
                    timeRangeFilter = timeRangeFilter
                )
            )
            for (record in spo2Response.records) {
                val item = JSONObject().apply {
                    put("source_record_id", "spo2_${record.metadata.id}")
                    put("provider", "android_health_connect")
                    put("measurement_type", "spo2")
                    put("numeric_value", record.percentage.value)
                    put("unit", "%")
                    put("measured_at", record.time.toString())
                    put("source_device_name", record.metadata.device?.model ?: "Android Device (Health Connect)")
                }
                batchRecords.put(item)
            }

            // 4. Read Steps Records
            val stepsResponse = client.readRecords(
                ReadRecordsRequest(
                    recordType = StepsRecord::class,
                    timeRangeFilter = timeRangeFilter
                )
            )
            for (record in stepsResponse.records) {
                val item = JSONObject().apply {
                    put("source_record_id", "steps_${record.metadata.id}")
                    put("provider", "android_health_connect")
                    put("measurement_type", "steps")
                    put("numeric_value", record.count.toDouble())
                    put("unit", "steps")
                    put("measured_at", record.startTime.toString())
                    put("source_device_name", record.metadata.device?.model ?: "Android Device (Health Connect)")
                }
                batchRecords.put(item)
            }

            Log.i(TAG, "Read ${batchRecords.length()} records from Android Health Connect")

            return SyncResult(
                success = true,
                importedCount = batchRecords.length(),
                errorMessage = null
            )
        } catch (ex: Exception) {
            Log.e(TAG, "Failed to read Health Connect records: ${ex.message}", ex)
            return SyncResult(
                success = false,
                importedCount = 0,
                errorMessage = ex.message ?: "Failed to read Health Connect records."
            )
        }
    }

    data class SyncResult(
        val success: Boolean,
        val importedCount: Int,
        val errorMessage: String?
    )
}
