# Né — application Android Flutter

**Né** est un prototype local en français pour le suivi du cycle, les repères de fertilité, l’éducation à la santé reproductive et un suivi calendaire de grossesse. Le projet est fourni en Dart/Flutter pour être ouvert sur un ordinateur, essayé sur un téléphone Android et modifié.

> Ce prototype n’est pas un dispositif médical. Les estimations ne constituent pas un diagnostic, une contraception ni un suivi prénatal. Les articles et les contenus informatifs restent à faire valider par des professionnels avant toute diffusion publique.

## Fonctions présentes

- Onboarding animé et illustré, choix d’objectif et pseudo facultatif.
- Thèmes clair rose pâle/blanc et sombre rose foncé/noir doux.
- Suivi local des dates de règles, durée des cycles et calendrier avec fiabilité de prédiction explicitée.
- Parcours conception avec fenêtre fertile indiquée comme estimative, jamais comme confirmation d’ovulation ou contraception.
- Parcours grossesse : âge gestationnel, priorité à une date d’accouchement confirmée par un professionnel, trame interactive de 42 semaines et gestion locale des rendez-vous/rappels.
- Articles embarqués accessibles hors ligne, signalés comme contenus de démonstration à relire.
- Anoushka identifiée comme une IA. Aucune question n’est transmise avant l’accord de l’utilisatrice. Après accord, seuls le texte saisi et un identifiant de session aléatoire sont envoyés au serveur choisi; aucun champ du profil n’est ajouté automatiquement.
- Profil avec changement de pseudo/objectif, export JSON ou CSV, préférences de notification et effacement local à double confirmation.

## Démarrage rapide

1. Installer Flutter stable, Android Studio et Android SDK 36 (ou ultérieur), puis vérifier `flutter doctor`.
2. Décompresser le ZIP du projet et ouvrir un terminal à la racine de `ne_app`.
3. Lancer :

```bash
flutter pub get
flutter analyze
flutter test
flutter run
```

4. Brancher un téléphone Android avec le débogage USB activé, accepter la demande sur le téléphone, puis lancer `flutter devices` et `flutter run -d <identifiant>`. Les consignes détaillées sont dans [Installation et tests](docs/INSTALLATION_TESTS.md).

## Générer une APK pour essai

```bash
flutter build apk --release
```

L’APK sera créée dans `build/app/outputs/flutter-apk/app-release.apk`. Pour l’installer par USB :

```bash
adb install -r build/app/outputs/flutter-apk/app-release.apk
```

Cette configuration de test signe le build release avec la clé debug Android. **Elle n’est pas destinée au Google Play ni à une distribution publique.** Voir les limites et les contrôles restant à faire dans [Validation et limites](docs/VALIDATION_LIMITES.md).

## Architecture du projet

```text
lib/
  app.dart, app_controller.dart, main.dart
  core/                     thèmes et formatage
  models/                   profil, cycles, rendez-vous, prédictions, articles
  screens/                  onboarding, accueil, calendrier, articles, Anoushka, profil
  services/                 SQLCipher, calculs, notifications, exports, API
  widgets/                  illustrations vectorielles dessinées en code
assets/data/articles.json   articles embarqués hors ligne
docs/                       cadrage, installation, architecture, confidentialité,
                            validation et références techniques
test/                       tests des règles de calcul et du client HTTP simulé
```

- Stockage des données structurées : SQLite chiffré par SQLCipher.
- Clé de base : générée aléatoirement et conservée via le stockage sécurisé Android.
- Préférences d’interface : `shared_preferences`; aucune donnée médicale ne doit y être ajoutée.
- Rappels : notifications locales Android, contenu volontairement discret.
- API conversationnelle : `https://anoushka.onrender.com` par défaut. Le client peut être reconfiguré par `--dart-define=ANOUSHKA_API_BASE_URL=https://...`; utiliser uniquement une origine HTTPS compatible avec `/api/chat`.

Pour les décisions détaillées et la protection des données, consulter [Décisions produit](docs/DECISIONS_PRODUIT.md), [Architecture](docs/ARCHITECTURE.md), [Confidentialité et sécurité](docs/CONFIDENTIALITE_SECURITE.md), [Installation et tests](docs/INSTALLATION_TESTS.md), [Validation et limites](docs/VALIDATION_LIMITES.md) et [Références techniques](docs/REFERENCES_TECHNIQUES.md).
