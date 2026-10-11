import 'package:flutter/material.dart';
import '../core/constants/app_constants.dart';

class ResponsiveHelper {
  static bool isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width < AppConstants.mobileBreakpoint;

  static bool isTablet(BuildContext context) =>
      MediaQuery.of(context).size.width >= AppConstants.mobileBreakpoint &&
      MediaQuery.of(context).size.width < AppConstants.tabletBreakpoint;

  static bool isWeb(BuildContext context) =>
      MediaQuery.of(context).size.width >= AppConstants.tabletBreakpoint;

  static int getGridCrossAxisCount(BuildContext context, {int mobile = 2, int tablet = 3, int web = 4}) {
    if (isWeb(context)) return web;
    if (isTablet(context)) return tablet;
    return mobile;
  }

  static double getHorizontalPadding(BuildContext context) {
    if (isWeb(context)) return 32.0;
    if (isTablet(context)) return 24.0;
    return 16.0;
  }
}
