# Flutter ProGuard Rules
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }

# Material 3 & AndroidX
-keep class com.google.android.material.** { *; }
-keep class androidx.appcompat.** { *; }
-keep class androidx.core.** { *; }

# Firebase Core & Firestore
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# Prevent obfuscation of Kotlin reflection metadata
-keep class kotlin.Metadata { *; }
-keepclassmembers class * {
    @kotlin.jvm.JvmField *;
}

# Preserve synthetic accessor methods
-keepattributes *Annotation*,EnclosingMethod,Signature,InnerClasses,SourceFile,LineNumberTable
