# Architecture technique

## Vue d’ensemble

Application Flutter/Dart mono-repo, Android-first, en couches légères. L’application est offline-first pour les fonctions de suivi. Aucune authentification, compte utilisateur, synchronisation cloud ou backend Né n’est présent.

```text
Écrans Flutter
  ├─ onboarding / accueil / calendrier / articles / profil
  └─ chat Anoushka (appel explicite après accord)
            │
            ▼
AppController (état de session, notifications, préférences)
  ├─ PredictionService       calculs locaux de cycle
  ├─ PregnancyService        âge gestationnel et date estimée
  ├─ DatabaseService         SQLCipher local
  ├─ NotificationService     rappels Android locaux
  ├─ ArticleService          JSON embarqué
  ├─ ExportService           fichiers temporaires et feuille de partage
  └─ AnoushkaClient          POST HTTPS vers le service choisi
```

## Entrée et état

- `lib/main.dart` initialise Flutter, les formats de date français et construit le contrôleur.
- `lib/app.dart` observe `AppController`, applique les thèmes, choisit l’onboarding ou l’application et offre un écran de récupération si la base locale ne s’ouvre pas.
- `lib/app_controller.dart` charge profil, cycles et rendez-vous; publie l’état via `ChangeNotifier`.
- `lib/core/app_theme.dart` contient les palettes rose pâle/blanc et rose foncé/noir doux.
- `lib/widgets/handdrawn_illustrations.dart` dessine en CustomPainter des illustrations vectorielles, sans appel de génération d’images.

## Écrans

- `OnboardingScreen`: choix unique d’objectif, pseudo, consentement facultatif de suivi, langue; animations de fleur et cartes illustrées.
- `MainShell`: navigation bas de page Accueil / Calendrier / Articles / Anoushka; lien vers Profil.
- `HomeScreen`: tableaux de bord cycle, conception ou grossesse; formulaires de cycle, dates grossesse, rendez-vous.
- `CalendarScreen`: vue mensuelle, événements notés/estimés, fertilité estimée et rendez-vous.
- `PregnancyWeekScreen`: navigation entre semaines 1–42; trame calendaire et repères organisationnels non médicaux.
- `ArticlesScreen`: filtres locaux, fiches de lecture du JSON embarqué.
- `AnoushkaScreen`: chat en mémoire vive, bannière IA et dialogue de consentement.
- `ProfileScreen`: pseudo, objectif, thème, notifications, export et effacement.

## Modèles et services

### Cycle

`CycleRecord` est une observation utilisateur avec date de début, longueur du cycle, longueur des règles et note. `PredictionService` trie les observations, donne un poids progressif aux cycles récents, filtre certains outliers lorsque l’échantillon contient au moins quatre valeurs, puis calcule prochaine date, fenêtre fertile et dispersion. `ReliabilityLevel` distingue données insuffisantes, faible, moyenne et haute.

Ces fonctions sont déterministes et testées. Les seuils n’ont pas reçu de validation médicale.

### Grossesse

`UserProfile` contient une date des dernières règles, une date prévue éventuelle et un booléen de confirmation professionnelle. `PregnancyService` utilise la date prévue lorsqu’elle est confirmée; autrement, il utilise les dernières règles. Si aucune source valide n’est disponible, il n’invente pas un âge gestationnel.

### Stockage local

`DatabaseService` gère trois tables : `profile`, `cycles`, `appointments`. Le package `sqflite_sqlcipher` chiffre la base avec un secret aléatoire de 256 bits (encodé en base64url) conservé sous une clé `ne_database_key_v1` via `flutter_secure_storage`. L’effacement ferme et supprime le fichier, supprime la clé, efface les préférences et annule les rappels.

`SharedPreferences` ne contient que des préférences simples : fin d’onboarding, thème, langue, activation et délai des rappels. Ne pas y ajouter de dates de santé, réponses de chat ou pseudonymes.

### Rappels

`NotificationService` utilise `flutter_local_notifications` avec timezone de l’appareil. Il demande l’autorisation Android 13+, programme des alarmes inexactes, restaure les événements après redémarrage et affiche un titre/texte générique. Les détails restent dans l’application.

### Articles et exports

`ArticleService` charge `assets/data/articles.json`, disponible sans réseau. `ExportService` génère temporairement un JSON ou CSV et appelle la feuille de partage Android. Le fichier temporaire est retiré après le retour de la feuille; une copie choisie par l’utilisatrice ne peut pas être contrôlée par Né.

### Anoushka

`AnoushkaClient` cible par défaut `https://anoushka.onrender.com/api/chat` (surcharge via `--dart-define=ANOUSHKA_API_BASE_URL=...`). La requête est exactement `{message, session_id}`. Les réponses attendues sont `reponse` et `source` facultative. Une session aléatoire est générée localement et renouvelée après effacement du chat. Le client est créé dans l’écran et fermé lors de sa destruction. Aucun contexte venant de la base de données n’est ajouté.

L’accord affiché par l’application est un consentement par conversation dans la session de l’écran, pas un audit des pratiques du fournisseur. Voir [Confidentialité et sécurité](CONFIDENTIALITE_SECURITE.md).

## Dépendances principales

Voir `pubspec.yaml` et `pubspec.lock`. Elles incluent Flutter local notifications, SQLCipher, stockage sécurisé, table_calendar, `http`, `share_plus`, `shared_preferences`, `intl`, timezone et path_provider. Les versions sont épinglées par `pubspec.lock` pour rendre les builds reproductibles.
