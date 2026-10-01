# Installation, exécution et tests

## Environnement requis

- Flutter stable **3.47.5** ou une version ultérieure compatible avec les contraintes de `pubspec.yaml`.
- Dart **3.13.4** fourni avec Flutter 3.47.5.
- Android Studio avec Android SDK **36**, Android Build Tools et Android SDK Command-line Tools.
- Java **17 ou 21** (le build vérifié utilise Java 21).
- Environ 5 Go d’espace libre pour Flutter, Android SDK, dépendances et caches de compilation.
- Pour installer sur un téléphone : câble USB ou transfert manuel de l’APK; le débogage USB est nécessaire pour `adb install`.

Le manifeste compilé cible Android SDK 36 et accepte Android API 24 ou ultérieur (`minSdk = 24`). Les fichiers `android/local.properties`, `.dart_tool/` et `build/` sont locaux/générés et ne doivent pas être partagés dans le ZIP source.

## Installation de Flutter et SDK Android

1. Installer Flutter stable en suivant le [guide Flutter officiel](https://docs.flutter.dev/get-started/install).
2. Installer Android Studio et, dans **SDK Manager**, sélectionner Android SDK Platform 36 et Android SDK Build-Tools 36.x. Installer les Command-line Tools.
3. Ajouter `flutter/bin` au `PATH`.
4. Dans un terminal :

```bash
flutter doctor
flutter doctor --android-licenses
```

Accepter les licences Android et s’assurer que la rubrique Android toolchain ne comporte pas d’erreur bloquante. Le projet inclut le wrapper Gradle et Flutter régénère le chemin local de SDK lors du build.

### Windows (PowerShell)

```powershell
flutter --version
cd C:\chemin\vers\ne_app
flutter pub get
flutter analyze
flutter test
flutter run
```

Pour un build :

```powershell
flutter build apk --release
```

### macOS / Linux

```bash
flutter --version
cd /chemin/vers/ne_app
flutter pub get
flutter analyze
flutter test
flutter run
```

Build :

```bash
flutter build apk --release
```

## Essayer sur un appareil Android

1. Sur le téléphone, activer les options développeur, puis **Débogage USB**.
2. Brancher le téléphone et accepter l’empreinte de l’ordinateur sur l’écran du téléphone.
3. À la racine du projet :

```bash
flutter devices
flutter run -d <identifiant_affiché>
```

Si `adb` est disponible :

```bash
adb devices
adb install -r build/app/outputs/flutter-apk/app-debug.apk
```

La première utilisation crée la base chiffrée et la clé locale. Si l’application est désinstallée, les données locales peuvent être perdues; l’utilisatrice doit exporter ses données avant toute opération qui pourrait effacer l’application.

## Générer et installer l’APK

Commande de test :

```bash
flutter build apk --release
```

Fichier produit :

```text
build/app/outputs/flutter-apk/app-release.apk
```

Pour installer en USB :

```bash
adb install -r build/app/outputs/flutter-apk/app-release.apk
```

Pour le transfert manuel, copier `app-release.apk` sur le téléphone, ouvrir le fichier et autoriser l’installation de cette source si Android le demande. N’envoyer l’APK qu’à des testeurs de confiance.

> Le build release de ce prototype est volontairement signé par la clé **debug** configurée dans `android/app/build.gradle.kts`. Il est adapté aux essais locaux uniquement. Avant publication, créer et protéger un keystore de publication, configurer la signature via des secrets hors du dépôt et supprimer la signature debug.

## Tests et contrôles

À chaque modification :

```bash
flutter pub get
flutter analyze
flutter test
```

Les tests couvrent les estimations de cycle, les seuils de fiabilité, la priorité de la date obstétricale confirmée, le calcul depuis les dernières règles et le contrat réseau Anoushka avec un client HTTP simulé. Ils **n’appellent pas** l’API Render.

Test manuel recommandé sur au moins deux versions Android :

- onboarding, saisie du pseudo et changement de thème;
- saisie de cycles, dates hors plage et fiabilité affichée;
- dates des deux types de grossesse, priorité de la date confirmée;
- rendez-vous, notifications autorisées/refusées et rappel après redémarrage;
- export JSON/CSV et effacement local complet;
- chat : vérifier le dialogue de consentement, refuser puis accepter, couper Internet, effacer la conversation;
- mise en veille, redémarrage, désinstallation et comportement de restauration;
- textes français, tailles de police Android augmentées, mode sombre et lecteurs d’écran.

## Dépannage

### Licence Android manquante

```bash
flutter doctor --android-licenses
```

### Nettoyer les caches de build

```bash
flutter clean
flutter pub get
flutter build apk --release
```

### L’appareil ne paraît pas dans `flutter devices`

Vérifier le câble, activer le débogage USB, accepter l’autorisation à l’écran du téléphone et relancer `adb devices`. Sous Windows, installer le pilote USB correspondant au fabricant.

### Rappels absents

Android peut refuser les notifications, suspendre l’application ou retarder les alarmes inexactes pour économiser l’énergie. Vérifier l’autorisation de notification, les notifications de l’application et les restrictions batterie du téléphone. Né n’exige pas d’alarme exacte.

### Chat indisponible

Le suivi local et les articles continuent de fonctionner hors ligne. Anoushka requiert Internet et un backend compatible; Render peut mettre le serveur en veille, changer son API ou limiter son usage. Aucune donnée de profil n’est envoyée automatiquement.
