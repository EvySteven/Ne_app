# Confidentialité et sécurité — prototype Né

Ce document décrit le comportement de ce prototype, pas une certification ni un avis juridique. Le contenu doit être revu avant test public ou déploiement.

## Données et emplacements

| Donnée | Emplacement | Partagée automatiquement ? |
|---|---|---|
| Pseudo, objectif, dates de grossesse | Table `profile` de SQLite chiffré | Non |
| Dates, durées et notes de cycle | Table `cycles` de SQLite chiffré | Non |
| Rendez-vous, lieu, notes | Table `appointments` de SQLite chiffré | Non |
| Thème, langue, état onboarding, activation/délai de rappels | `SharedPreferences` Android | Non; pas de santé ni de pseudo |
| Conversation Anoushka | Mémoire du widget tant qu’il est ouvert | Seulement chaque question explicitement envoyée après acceptation; aucune synchronisation Né |
| Fichier JSON/CSV d’export | Fichier temporaire, puis emplacement choisi dans la feuille Android | Oui seulement après action d’export; les copies partagées sortent du contrôle de Né |

La base SQLCipher reçoit un secret aléatoire généré sur l’appareil et stocké par `flutter_secure_storage`. Les sauvegardes automatiques Android sont désactivées dans le manifeste, afin d’éviter de restaurer la base sans sa clé. Une clé perdue rend la base chiffrée illisible.

## Ce qui est envoyé à Anoushka

Origine sélectionnée : `https://anoushka.onrender.com`. L’application n’envoie rien lorsque l’écran est ouvert, lorsque le texte est saisi ou lorsque la personne refuse le dialogue. Pour chaque question explicitement envoyée après acceptation, le JSON transmis est limité à :

```json
{
  "message": "le texte saisi par l’utilisatrice",
  "session_id": "identifiant aléatoire éphémère"
}
```

Aucun pseudo, but de parcours, date de cycle, date de grossesse, rendez-vous, note locale, numéro d’appareil ou clé n’est ajouté intentionnellement au payload. L’identifiant sert à relier les messages au sein de la conversation; il est renouvelé quand l’utilisatrice efface la conversation.

Le texte du message reste libre et peut contenir une donnée personnelle si l’utilisatrice l’écrit. L’interface conseille de ne pas saisir nom, téléphone, adresse ou identifiants. Les connexions côté application exigent HTTPS.

### Limites du consentement

- Le serveur Render et le fournisseur du modèle peuvent recevoir la question pour produire une réponse.
- La conservation, les journaux, l’éventuelle revue humaine, les sous-traitants et la juridiction du service n’ont pas été vérifiés.
- L’application n’a pas confirmé le comportement d’API au moyen d’une question réelle; les tests du client sont mockés.
- Effacer la conversation dans l’application efface son affichage local et crée un nouvel identifiant, mais ne demande pas d’effacement à Render.
- L’étiquette « IA » et la mise en garde médicale n’établissent pas la fiabilité ou la conformité du service.

Pour lancer avec une autre origine HTTPS compatible :

```bash
flutter run --dart-define=ANOUSHKA_API_BASE_URL=https://votre-service.example
flutter build apk --release --dart-define=ANOUSHKA_API_BASE_URL=https://votre-service.example
```

Ne pas intégrer de clé API privée dans l’APK; toute clé embarquée dans un client mobile peut être extraite.

## Notifications

Les rappels sont locaux. Leur texte visible sur l’écran verrouillé est générique et ne cite ni rendez-vous, ni dates, ni cycle. Android peut retarder ou bloquer la notification en fonction des autorisations et de l’économie d’énergie. Les notifications sont programmées comme alarmes inexactes; aucune permission d’alarme exacte n’est demandée.

## Export et suppression

L’export comprend des informations sensibles, notamment le pseudo, les dates, les rendez-vous, les lieux et les notes, ainsi que les préférences non médicales de thème, langue et rappels. Il nécessite une action dans Profil et le choix explicite JSON ou CSV. Né tente de supprimer le fichier temporaire après avoir appelé la feuille de partage; les copies enregistrées ou envoyées par l’application cible restent hors du contrôle de Né.

La suppression de compte local demande deux confirmations et efface la base, la clé sécurisée, les préférences et les rappels connus sur ce téléphone. Elle n’efface pas les exports externes ni les données éventuellement retenues côté Render. La désinstallation Android peut aussi supprimer toutes les données locales; faire un export avant toute désinstallation si une copie est souhaitée.

## Contrôles à faire avant un pilote public

- Publier une notice de confidentialité et les finalités, bases, durées de conservation et voies de contact.
- Auditer le serveur, Render et le fournisseur d’IA, y compris journaux, rétention, localisation et suppression.
- Vérifier les exigences de protection des données et des données de santé dans les territoires de test.
- Revoir le comportement d’effacement, export, restauration et perte de clé sur appareils réels.
- Faire un audit de dépendances et de sécurité Android, tests d’intrusion et revue du manifeste.
- Établir un protocole de contenu santé et de gestion des urgences; faire relire articles et calculs par des professionnels.
- Ne pas distribuer la clé debug, un APK public ou une app store avant la signature release dédiée et ces revues.
