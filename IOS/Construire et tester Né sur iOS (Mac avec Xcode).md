# Construire et tester Né sur iOS (Mac avec Xcode)

## En bref

Le projet Né est écrit en **Flutter/Dart** : la même base de code peut fonctionner sur Android et iOS. La cible iOS du projet est maintenant présente, avec des réglages et un canal Swift pour empêcher la sauvegarde iCloud de la base de santé locale.

**Une compilation iOS n’est pas possible depuis un PC Windows/Linux ni depuis ce Sandbox Linux.** Flutter exige **macOS et Xcode** pour générer ou signer une application iOS. Ce projet conserve toutefois le build **APK Android**, qui peut être construit depuis Windows, macOS ou Linux avec Flutter et le SDK Android.

- Minimum iOS configuré : **iOS 15.0**.
- Identifiant provisoire du bundle : `bf.ne.neapp`. Il devra être remplacé par un Bundle ID unique que tu contrôles pour une installation signée ou une distribution.
- Les notifications iOS demandent l’autorisation au moment où l’utilisatrice active les rappels dans Profil.
- La base SQLCipher est marquée « exclue des sauvegardes » dans iOS; la clé du Keychain est configurée pour ne pas se synchroniser vers iCloud Keychain et pour ne pas migrer vers un autre appareil.
- Le projet a été analysé et testé côté Dart/Android dans le Sandbox, mais **n’a pas pu être compilé ou testé sur simulateur/iPhone** faute de macOS/Xcode. La première compilation iOS devra être vérifiée sur un Mac.

## Prérequis sur le Mac

1. Installer Flutter stable **3.47.5** (ou une version ultérieure compatible avec les contraintes du projet) et vérifier `flutter doctor -v`.
2. Installer la version actuelle de **Xcode** depuis Apple. Lancer Xcode une fois et accepter les licences.
3. Configurer les outils de ligne de commande Xcode si nécessaire :

   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -runFirstLaunch
   sudo xcodebuild -license
   xcodebuild -downloadPlatform iOS
   ```

   Remplacer le chemin de Xcode si l’application a été installée ailleurs.
4. Installer **CocoaPods**. `sqflite_sqlcipher` fournit actuellement sa dépendance iOS via CocoaPods; Flutter 3.47 peut combiner CocoaPods et Swift Package Manager selon les plugins. Laisser Flutter gérer les fichiers d’intégration générés.
5. Décompresser le projet et ouvrir un terminal à la racine de `ne_app`.

Références officielles : [configuration Flutter pour iOS](https://docs.flutter.dev/platform-integration/ios/setup) et [build et distribution iOS avec Flutter](https://docs.flutter.dev/deployment/ios).

## Essayer dans le simulateur iOS

Depuis la racine du projet :

```bash
flutter pub get
flutter doctor -v
flutter devices
open -a Simulator
flutter run -d <identifiant_du_simulateur>
```

L’identifiant est celui affiché par `flutter devices`. Si Flutter signale une dépendance native, installer/mettre à jour CocoaPods, puis relancer `flutter pub get` et `flutter run`. Ne pas supprimer les fichiers iOS générés par Flutter ou les configurations Xcode que CocoaPods/SPM produit.

On peut aussi ouvrir l’espace Xcode :

```bash
open ios/Runner.xcworkspace
```

> Sur les nouvelles versions de Flutter, l’intégration des packages Apple peut combiner SPM et CocoaPods. Ouvrir le workspace `Runner.xcworkspace` lorsqu’il est disponible; ne pas ouvrir seulement `Runner.xcodeproj` pour une compilation qui dépend des plugins CocoaPods.

## Essayer sur un iPhone physique

1. Brancher l’iPhone au Mac, le déverrouiller et accepter **Faire confiance à cet ordinateur**.
2. Sur l’iPhone, activer **Réglages → Confidentialité et sécurité → Mode développeur**, puis redémarrer et confirmer.
3. Dans Xcode, ouvrir `ios/Runner.xcworkspace`.
4. Choisir la cible **Runner → Signing & Capabilities**; activer la signature gérée automatiquement, choisir ton compte/équipe Apple et enregistrer un Bundle ID unique.
5. Dans le menu des appareils Xcode ou dans `flutter devices`, sélectionner l’iPhone puis lancer :

   ```bash
   flutter run -d <identifiant_de_l_iphone>
   ```

Apple indique qu’un compte Apple personnel peut permettre de tester localement sur un appareil; la signature, les profils et les limites de distribution dépendent de la configuration Apple. Pour distribuer à d’autres personnes, suivre une filière Apple appropriée et vérifier les exigences d’adhésion et de signature en vigueur.

## Générer une archive iOS / IPA

Le `.ipa` est le format iOS. Il **ne remplace pas** l’APK, qui est exclusivement un format Android.

1. Sur le Mac, s’assurer que l’application s’exécute sur simulateur ou appareil.
2. Dans Xcode, définir une équipe Apple et un Bundle ID unique dans **Runner → Signing & Capabilities**. Garder le nom d’affichage « Né »; ne pas modifier le minimum iOS sans vérifier chaque plugin.
3. Construire :

   ```bash
   flutter build ipa --release --build-name 1.0.0 --build-number 1
   ```

4. Flutter place l’archive exportée dans `build/ios/ipa/` lorsque la configuration de signature le permet. En cas d’erreur de signature, ouvrir `ios/Runner.xcworkspace`, corriger l’équipe/profil ou le Bundle ID, puis relancer. Un IPA signé pour un appareil ou un canal de distribution n’est pas forcément installable sur n’importe quel iPhone.
5. Pour un test personnel, `flutter run` sur l’iPhone est le chemin le plus direct. Pour une bêta distribuée, préparer la signature et la distribution Apple correspondantes (par exemple TestFlight) et suivre les exigences Apple applicables.

## Revenir sur Windows/Linux et produire l’APK Android

La présence du dossier `ios/` ne modifie pas la procédure Android. Sur Windows, macOS ou Linux, avec Flutter, Java 17/21 et Android SDK 36 :

```bash
flutter pub get
flutter analyze
flutter test
flutter build apk --release
```

APK produite :

```text
build/app/outputs/flutter-apk/app-release.apk
```

Installation USB :

```bash
adb install -r build/app/outputs/flutter-apk/app-release.apk
```

Cette version de test Android utilise la clé de signature debug et ne doit pas être publiée sur Google Play.

## Points à tester spécialement sur iOS

- Onboarding, bascule clair/sombre, clavier, choix de langue et pseudo.
- Création, fermeture/réouverture de la base SQLCipher; vérifier que l’attribut d’exclusion iCloud est présent sur le dossier de la base.
- Notifications : autoriser, refuser, puis gérer les autorisations dans les Réglages iOS; vérifier le texte discret et les délais possibles du système.
- Export JSON/CSV et feuille native de partage iOS, notamment sur iPad.
- Effacement complet et comportement du Keychain après réinstallation.
- Test réel d’une sauvegarde/restauration iOS pour confirmer que la base et sa clé ne sont pas restaurées depuis iCloud.
- Connexion Anoushka uniquement après accord; tester hors ligne et la reprise après timeout.
- VoiceOver, Dynamic Type, contraste, thème sombre, safe areas, tailles iPhone/iPad.
- Examiner dans Xcode les avertissements des plugins, CocoaPods/SPM, l’icône et l’écran de lancement.

L’exclusion iCloud est une mesure de configuration native, **pas une preuve d’audit de sécurité**. Confirmer son comportement sur appareil réel avant un pilote public.

## Résolution des problèmes courants

### « iOS builds are only supported on macOS »

C’est une limite normale de Flutter/Xcode : transférer ou cloner la source sur un Mac pour la cible iOS. Le PC Windows/Linux peut toujours produire le build Android et exécuter les tests Dart.

### Plugins iOS ou CocoaPods introuvables

Vérifier Xcode, CocoaPods, puis exécuter :

```bash
flutter clean
flutter pub get
flutter doctor -v
```

Relancer ensuite `flutter run` ou `flutter build ipa`. Ne pas retirer `sqflite_sqlcipher`; il fournit le chiffrement local de la base.

### Échec de signature

Vérifier qu’un compte Apple/une équipe est sélectionné dans Xcode, que le Bundle ID est unique, que l’iPhone est approuvé et que la signature automatique/provisioning profile est configurée. Ne jamais ajouter de certificats ou mots de passe de signature dans le dépôt source.

### Nom d’application ou Bundle ID à modifier

Le nom affiché est configuré dans `ios/Runner/Info.plist`. Le Bundle ID est configuré dans `ios/Runner.xcodeproj/project.pbxproj` et peut aussi être choisi dans les paramètres Runner d’Xcode. Pour une distribution, utilise un identifiant unique associé à ton équipe Apple.
