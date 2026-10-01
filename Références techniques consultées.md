# Références techniques consultées

Consultation : 1 octobre 2026. Les versions de packages ci-dessous sont celles observées publiquement à cette date; les versions réellement utilisées sont celles résolues dans `pubspec.lock`.

## Flutter et Android

- Liste officielle des versions Linux Flutter : https://storage.googleapis.com/flutter_infra_release/releases/releases_linux.json
- Environnement de build du prototype : Flutter stable 3.47.5, Dart 3.13.4, Java 21, Android SDK 36 / Build Tools 36.0.0. `flutter doctor` a confirmé la toolchain Android; Chrome et les outils de compilation Linux desktop ne sont pas présents et ne sont pas nécessaires à l’APK Android.

## Packages

| Package | Version observée | Usage / contrainte vérifiée |
|---|---:|---|
| [`flutter_local_notifications`](https://pub.dev/packages/flutter_local_notifications) | 22.3.1 | Notifications locales; Flutter >= 3.38.1; planification zonée avec `timezone`; permissions et receivers de redémarrage ajoutés; rappels inexactes pour éviter une permission d’alarme exacte. |
| [`sqflite_sqlcipher`](https://pub.dev/packages/sqflite_sqlcipher) | 3.4.1 | SQLite SQLCipher, ouverture avec `password`; package communautaire/fork à revoir avant production; sa doc demande une règle ProGuard SQLCipher en release. |
| [`flutter_secure_storage`](https://pub.dev/packages/flutter_secure_storage) | 11.2.0 | Clé de base chiffrée côté plateforme; la documentation recommande de désactiver la sauvegarde automatique Android pour éviter une clé manquante après restauration. |
| [`flutter_timezone`](https://pub.dev/packages/flutter_timezone) | 5.1.0 | Fuseau IANA local retourné via `FlutterTimezone.getLocalTimezone()` et `identifier`. |
| [`share_plus`](https://pub.dev/packages/share_plus) | 13.3.0 | Feuille de partage Android, API `SharePlus.instance.share(ShareParams(files: ...))`; Flutter >= 3.38.1, Java 17, Kotlin 2.2, AGP >= 8.12.1. |
| [`table_calendar`](https://pub.dev/packages/table_calendar) | 3.2.1 | Calendrier mensuel et marqueurs personnalisés. |
| [`shared_preferences`](https://pub.dev/packages/shared_preferences) | 2.5.5 | Préférences non sensibles de thème, langue et onboarding. |
| [`intl`](https://pub.dev/packages/intl) | 0.20.3 | Formatage français des dates. |
| [`path_provider`](https://pub.dev/packages/path_provider) | 2.1.6 | Création temporaire des fichiers d’export. |
| [`http`](https://pub.dev/packages/http) | 1.6.0 | Appel explicite de l’API Anoushka après consentement. |
| [`timezone`](https://pub.dev/packages/timezone) | 0.11.1 | Fuseaux horaires des notifications planifiées. |
| [`cross_file`](https://pub.dev/packages/cross_file) | `pubspec.lock` | Fichiers transmis à la feuille de partage. |

Documentation des configurations Android utilisées :

- Notifications et manifest : https://pub.dev/packages/flutter_local_notifications#androidmanifestxml-setup
- Stockage sécurisé Android et désactivation du backup : https://pub.dev/packages/flutter_secure_storage#android
- SQLCipher et règle ProGuard : https://pub.dev/packages/sqflite_sqlcipher
- API de partage : https://pub.dev/packages/share_plus#share-files

## API Anoushka fournie par la fondatrice

- URL sélectionnée explicitement par la fondatrice : https://anoushka.onrender.com/
- Le HTML public de la page appelle `POST /api/chat` avec `message` et `session_id`, puis lit `reponse` et éventuellement `source`.
- Il appelle également `POST /api/proposer` pour les contributions, mais cette route n’est pas utilisée par l’application Né.
- Aucune question de santé n’a été transmise pendant le développement; les tests du client HTTP utilisent un mock local.
- Le document de référence mentionne aussi `https://ne-chatbot-backend.onrender.com` comme autre origine FastAPI. Cette origine n’est pas utilisée dans ce build, car la fondatrice a choisi l’URL de la page publique.
- La conservation des messages par Render et le fournisseur d’IA, les conditions d’utilisation et le niveau de protection du service n’ont pas été audités. Le dialogue de consentement l’indique explicitement.
- Toute valeur de secret administrateur qui apparaît dans une pièce jointe doit être révoquée et retirée des fichiers distribuables; elle n’est pas reproduite dans ce projet.
