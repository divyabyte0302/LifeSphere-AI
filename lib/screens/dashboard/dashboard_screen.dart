import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_constants.dart';
import '../../core/routes/app_routes.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/health_provider.dart';
import '../../responsive/responsive_layout.dart';
import '../../widgets/metric_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentBottomNavIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HealthProvider>().initializeData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return ResponsiveLayout(
      mobile: _buildMobileLayout(context),
      web: _buildWebLayout(context),
    );
  }

  // Mobile Experience: Bottom navigation, compact cards, touch-friendly UI
  Widget _buildMobileLayout(BuildContext context) {
    final healthProvider = context.watch<HealthProvider>();
    final vitals = healthProvider.vitals;
    final env = healthProvider.environment;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.primaryEmerald.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.blur_on, color: AppTheme.primaryEmerald, size: 20),
            ),
            const SizedBox(width: 8),
            const Text(
              'LifeSphere AI',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () => Navigator.pushNamed(context, AppRoutes.notifications),
          ),
          IconButton(
            icon: const Icon(Icons.emergency_outlined, color: AppTheme.alertRose),
            onPressed: () => Navigator.pushNamed(context, AppRoutes.emergency),
          ),
        ],
      ),
      body: healthProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () => healthProvider.initializeData(),
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildAiEnvironmentalBanner(context, healthProvider),
                    const SizedBox(height: 16),
                    _buildSectionHeader('Live Physiological Vitals', Icons.favorite, AppTheme.alertRose),
                    const SizedBox(height: 8),
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                      childAspectRatio: 1.25,
                      children: [
                        MetricCard(
                          title: 'Heart Rate',
                          value: '${vitals?.heartRate.toInt() ?? "--"}',
                          unit: 'BPM',
                          icon: Icons.monitor_heart,
                          iconColor: AppTheme.alertRose,
                          subtitle: 'Resting: ${vitals?.restingHeartRate.toInt() ?? "--"} BPM',
                          statusColor: AppTheme.primaryEmerald,
                          onTap: () => Navigator.pushNamed(context, AppRoutes.health),
                        ),
                        MetricCard(
                          title: 'Blood Oxygen',
                          value: '${vitals?.bloodOxygen.toStringAsFixed(1) ?? "--"}',
                          unit: '%',
                          icon: Icons.water_drop,
                          iconColor: AppTheme.secondaryCyan,
                          subtitle: 'Optimal SpO2',
                          statusColor: AppTheme.primaryEmerald,
                          onTap: () => Navigator.pushNamed(context, AppRoutes.health),
                        ),
                        MetricCard(
                          title: 'Blood Pressure',
                          value: vitals?.bloodPressure ?? '--/--',
                          unit: 'mmHg',
                          icon: Icons.speed,
                          iconColor: AppTheme.infoBlue,
                          subtitle: 'Optimal Norm',
                          statusColor: AppTheme.primaryEmerald,
                          onTap: () => Navigator.pushNamed(context, AppRoutes.health),
                        ),
                        MetricCard(
                          title: 'Sleep Score',
                          value: '${vitals?.sleepScore.toInt() ?? "--"}',
                          unit: '/100',
                          icon: Icons.bedtime,
                          iconColor: Colors.deepPurple,
                          subtitle: '${vitals?.totalSleepHours ?? "--"} hrs total',
                          statusColor: AppTheme.primaryEmerald,
                          onTap: () => Navigator.pushNamed(context, AppRoutes.lifestyle),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    _buildSectionHeader('Ambient Environmental Intelligence', Icons.wb_sunny, AppTheme.accentAmber),
                    const SizedBox(height: 8),
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                      childAspectRatio: 1.25,
                      children: [
                        MetricCard(
                          title: 'Air Quality (AQI)',
                          value: '${env?.airQualityIndex.toInt() ?? "--"}',
                          unit: 'AQI',
                          icon: Icons.air,
                          iconColor: AppTheme.accentAmber,
                          subtitle: env?.airQualityCategory ?? 'Moderate',
                          statusColor: AppTheme.accentAmber,
                          onTap: () => Navigator.pushNamed(context, AppRoutes.environment),
                        ),
                        MetricCard(
                          title: 'UV Index',
                          value: '${env?.uvIndex.toStringAsFixed(1) ?? "--"}',
                          unit: 'UV',
                          icon: Icons.sunny,
                          iconColor: Colors.orange,
                          subtitle: env?.uvCategory ?? 'Moderate',
                          statusColor: Colors.orange,
                          onTap: () => Navigator.pushNamed(context, AppRoutes.environment),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentBottomNavIndex,
        onDestinationSelected: (idx) {
          setState(() => _currentBottomNavIndex = idx);
          if (idx == 1) Navigator.pushNamed(context, AppRoutes.health);
          if (idx == 2) Navigator.pushNamed(context, AppRoutes.environment);
          if (idx == 3) Navigator.pushNamed(context, AppRoutes.checkup);
          if (idx == 4) Navigator.pushNamed(context, AppRoutes.settings);
        },
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.favorite_outline), selectedIcon: Icon(Icons.favorite), label: 'Vitals'),
          NavigationDestination(icon: Icon(Icons.cloud_outlined), selectedIcon: Icon(Icons.cloud), label: 'Eco'),
          NavigationDestination(icon: Icon(Icons.smart_toy_outlined), selectedIcon: Icon(Icons.smart_toy), label: 'AI Check'),
          NavigationDestination(icon: Icon(Icons.settings_outlined), selectedIcon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),
    );
  }

  // Web Layout: Desktop Sidebar Navigation, Top Bar, Multi-Column Grid
  Widget _buildWebLayout(BuildContext context) {
    final healthProvider = context.watch<HealthProvider>();
    final vitals = healthProvider.vitals;
    final env = healthProvider.environment;

    return Scaffold(
      body: Row(
        children: [
          // Desktop Sidebar
          Container(
            width: 260,
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              border: Border(right: BorderSide(color: Colors.grey.withOpacity(0.2))),
            ),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryEmerald.withOpacity(0.15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.blur_on, color: AppTheme.primaryEmerald, size: 28),
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'LifeSphere AI',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    children: [
                      _buildSidebarTile(Icons.dashboard, 'Dashboard', true, () {}),
                      _buildSidebarTile(Icons.favorite, 'Health & Vitals', false, () => Navigator.pushNamed(context, AppRoutes.health)),
                      _buildSidebarTile(Icons.cloud, 'Environmental Intel', false, () => Navigator.pushNamed(context, AppRoutes.environment)),
                      _buildSidebarTile(Icons.smart_toy, 'AI Symptom Checkup', false, () => Navigator.pushNamed(context, AppRoutes.checkup)),
                      _buildSidebarTile(Icons.medication, 'Medications', false, () => Navigator.pushNamed(context, AppRoutes.medications)),
                      _buildSidebarTile(Icons.watch, 'Wearable Devices', false, () => Navigator.pushNamed(context, AppRoutes.wearable)),
                      _buildSidebarTile(Icons.trending_up, 'Longitudinal Trends', false, () => Navigator.pushNamed(context, AppRoutes.trends)),
                      _buildSidebarTile(Icons.restaurant, 'Diet & Hydration', false, () => Navigator.pushNamed(context, AppRoutes.diet)),
                      _buildSidebarTile(Icons.emergency, 'Emergency SOS', false, () => Navigator.pushNamed(context, AppRoutes.emergency)),
                      _buildSidebarTile(Icons.privacy_tip, 'Consent & Privacy', false, () => Navigator.pushNamed(context, AppRoutes.consent)),
                      _buildSidebarTile(Icons.settings, 'Settings', false, () => Navigator.pushNamed(context, AppRoutes.settings)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Main Web Content Area
          Expanded(
            child: Column(
              children: [
                // Top Web Bar
                Container(
                  height: 70,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor,
                    border: Border(bottom: BorderSide(color: Colors.grey.withOpacity(0.2))),
                  ),
                  child: Row(
                    children: [
                      const Text(
                        'Clinical & Environmental Command Center',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                      ),
                      const Spacer(),
                      ElevatedButton.icon(
                        icon: const Icon(Icons.bolt),
                        label: const Text('Run AI Synergy Engine'),
                        onPressed: () => healthProvider.triggerAiCorrelationAnalysis(),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primaryEmerald,
                          foregroundColor: Colors.white,
                        ),
                      ),
                      const SizedBox(width: 16),
                      CircleAvatar(
                        backgroundColor: AppTheme.primaryEmerald.withOpacity(0.2),
                        child: const Text('JV', style: TextStyle(color: AppTheme.primaryEmerald, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
                // Dashboard Grid
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildAiEnvironmentalBanner(context, healthProvider),
                        const SizedBox(height: 24),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Left 2/3 - Vitals and Metrics Grid
                            Expanded(
                              flex: 2,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _buildSectionHeader('Physiological Biomarkers', Icons.favorite, AppTheme.alertRose),
                                  const SizedBox(height: 12),
                                  GridView.count(
                                    crossAxisCount: 3,
                                    shrinkWrap: true,
                                    physics: const NeverScrollableScrollPhysics(),
                                    crossAxisSpacing: 16,
                                    mainAxisSpacing: 16,
                                    childAspectRatio: 1.3,
                                    children: [
                                      MetricCard(
                                        title: 'Heart Rate',
                                        value: '${vitals?.heartRate.toInt() ?? 72}',
                                        unit: 'BPM',
                                        icon: Icons.monitor_heart,
                                        iconColor: AppTheme.alertRose,
                                        subtitle: 'Resting: 64 BPM',
                                        statusColor: AppTheme.primaryEmerald,
                                      ),
                                      MetricCard(
                                        title: 'SpO2 Oxygen',
                                        value: '${vitals?.bloodOxygen ?? 98.4}',
                                        unit: '%',
                                        icon: Icons.water_drop,
                                        iconColor: AppTheme.secondaryCyan,
                                        subtitle: 'Arterial Saturation',
                                        statusColor: AppTheme.primaryEmerald,
                                      ),
                                      MetricCard(
                                        title: 'Blood Pressure',
                                        value: vitals?.bloodPressure ?? '118/76',
                                        unit: 'mmHg',
                                        icon: Icons.speed,
                                        iconColor: AppTheme.infoBlue,
                                        subtitle: 'Standard Target',
                                        statusColor: AppTheme.primaryEmerald,
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 24),
                                  _buildSectionHeader('Environmental Hazards', Icons.wb_sunny, AppTheme.accentAmber),
                                  const SizedBox(height: 12),
                                  GridView.count(
                                    crossAxisCount: 3,
                                    shrinkWrap: true,
                                    physics: const NeverScrollableScrollPhysics(),
                                    crossAxisSpacing: 16,
                                    mainAxisSpacing: 16,
                                    childAspectRatio: 1.3,
                                    children: [
                                      MetricCard(
                                        title: 'AQI Index',
                                        value: '${env?.airQualityIndex.toInt() ?? 68}',
                                        unit: 'AQI',
                                        icon: Icons.air,
                                        iconColor: AppTheme.accentAmber,
                                        subtitle: 'Moderate PM2.5',
                                        statusColor: AppTheme.accentAmber,
                                      ),
                                      MetricCard(
                                        title: 'UV Index',
                                        value: '${env?.uvIndex ?? 4.8}',
                                        unit: 'Index',
                                        icon: Icons.sunny,
                                        iconColor: Colors.orange,
                                        subtitle: 'Moderate Sun Exposure',
                                        statusColor: Colors.orange,
                                      ),
                                      MetricCard(
                                        title: 'Pollen Count',
                                        value: '${env?.pollenCount.toInt() ?? 142}',
                                        unit: 'gr/m³',
                                        icon: Icons.grass,
                                        iconColor: Colors.green,
                                        subtitle: 'Medium Grass Allergen',
                                        statusColor: Colors.orange,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 24),
                            // Right 1/3 - Recommendations & Actions
                            Expanded(
                              flex: 1,
                              child: Card(
                                child: Padding(
                                  padding: const EdgeInsets.all(20),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Active AI Clinical Directives',
                                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                      ),
                                      const SizedBox(height: 16),
                                      ...healthProvider.recommendations.map(
                                        (rec) => Container(
                                          margin: const EdgeInsets.only(bottom: 12),
                                          padding: const EdgeInsets.all(12),
                                          decoration: BoxDecoration(
                                            color: AppTheme.primaryEmerald.withOpacity(0.06),
                                            borderRadius: BorderRadius.circular(12),
                                            border: Border.all(color: AppTheme.primaryEmerald.withOpacity(0.2)),
                                          ),
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                rec.title,
                                                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                rec.description,
                                                style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSidebarTile(IconData icon, String title, bool isSelected, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: isSelected ? AppTheme.primaryEmerald : Colors.grey),
      title: Text(
        title,
        style: TextStyle(
          color: isSelected ? AppTheme.primaryEmerald : null,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: isSelected,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      onTap: onTap,
    );
  }

  Widget _buildSectionHeader(String title, IconData icon, Color color) {
    return Row(
      children: [
        Icon(icon, size: 18, color: color),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildAiEnvironmentalBanner(BuildContext context, HealthProvider provider) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryEmerald.withOpacity(0.15),
            AppTheme.secondaryCyan.withOpacity(0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.primaryEmerald.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.auto_awesome, color: AppTheme.primaryEmerald, size: 20),
              const SizedBox(width: 8),
              const Text(
                'AI Cross-System Environmental Intelligence',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
              ),
              const Spacer(),
              if (provider.isAnalyzingAi)
                const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            provider.aiAnalysisResult ??
                'Synergy Active: Ambient AQI 68 is safe for routine cardio, but elevated pollen (142 gr/m³) suggests keeping mild asthma rescue inhaler nearby.',
            style: const TextStyle(fontSize: 13, height: 1.4),
          ),
        ],
      ),
    );
  }
}
