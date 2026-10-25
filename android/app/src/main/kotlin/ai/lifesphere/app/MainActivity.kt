package ai.lifesphere.app

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController

/**
 * MainActivity for LifeSphere AI-X Native Android Companion Application.
 * Configures Health Connect permission contract and background synchronization triggers.
 */
class MainActivity : ComponentActivity() {

    companion object {
        private const val TAG = "LifeSphereMainActivity"
    }

    private lateinit var syncManager: HealthConnectSyncManager

    private val requestPermissionActivityContract = PermissionController.createRequestPermissionResultContract()

    private val requestPermissions = registerForActivityResult(requestPermissionActivityContract) { granted ->
        if (granted.containsAll(HealthConnectSyncManager.PERMISSIONS)) {
            Log.i(TAG, "All Health Connect permissions granted by user.")
        } else {
            Log.w(TAG, "Health Connect permissions partially granted or denied.")
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        syncManager = HealthConnectSyncManager(this)

        if (syncManager.isHealthConnectAvailable()) {
            checkAndRequestPermissions()
        } else {
            Log.w(TAG, "Health Connect is unavailable on this device.")
        }
    }

    private fun checkAndRequestPermissions() {
        val client = HealthConnectClient.getOrCreate(this)
        client.permissionController.getGrantedPermissions().thenAccept { granted ->
            if (!granted.containsAll(HealthConnectSyncManager.PERMISSIONS)) {
                requestPermissions.launch(HealthConnectSyncManager.PERMISSIONS)
            } else {
                Log.i(TAG, "Health Connect permissions already authorized.")
            }
        }
    }
}
