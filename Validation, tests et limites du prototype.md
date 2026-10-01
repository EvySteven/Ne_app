# Validation, tests et limites du prototype

## Contrôles automatisés

À la création de ce livrable, les commandes exécutées dans le Sandbox avec Flutter 3.47.5 / Dart 3.13.4 sont :

```text
flutter analyze  → No issues found
flutter test     → 12 tests passed
```

Les tests unitaires couvrent le calcul de prochaines règles, le niveau de fiabilité selon le nombre de cycles, le filtrage d’une valeur aberrante, l’âge de grossesse et la priorité à une date confirmée, ainsi que le format de la requête Anoushka via un `MockClient`. Aucun appel réel à Render ni partage de données utilisateur n’a été effectué.

Le build `flutter build apk --release` a réussi. Le fichier `app-release.apk` fait environ 70 Mo; `aapt` confirme l’identifiant `bf.ne.ne_app`, `minSdk 24`, `targetSdk 36`, et `apksigner verify` confirme une signature Android valide par la clé debug. SHA-256 final : `fa116c0d3098c23a3cc10f97da301f268392b38c10cdcdd94772616e450ec8d4`. L’APK n’a pas été installée ni exécutée sur un téléphone physique dans cet environnement.

## Limites connues

1. **Contenu médical** : les articles embarqués sont des textes de démonstration. Aucune validation médicale, obstétricale ou locale n’a été obtenue.
2. **Suivi grossesse par semaine** : l’application permet de naviguer entre les semaines et affiche des repères d’organisation, mais elle n’inclut pas encore de contenu clinique détaillé de développement, symptômes ou soins par semaine.
3. **Prédiction de cycle** : les durées utilisées pour le niveau de fiabilité sont mesurées entre des dates successives réellement notées; la durée habituelle ne sert qu’au premier repère. L’algorithme reste une heuristique de calendrier; ses seuils et sa valeur clinique ne sont pas validés. Il ne confirme pas l’ovulation, ne permet pas d’exclure une grossesse et n’est pas contraceptif.
4. **Anoushka** : seule la page publique et le contrat visible ont été consultés. L’API, le fournisseur de modèle, la rétention, l’exactitude, la disponibilité et les mécanismes d’effacement restent à vérifier. L’IA peut répondre de façon erronée.
5. **Langues** : le français fonctionne; Mooré et Dioula sont des options en préparation sans traduction validée.
6. **Communauté** : absente du MVP. La modération, la protection contre le harcèlement et la confidentialité doivent précéder toute fonction sociale.
7. **Notifications** : rappels inexactes sur Android; le système peut les retarder ou les suspendre.
8. **Localisation** : textes et formats sont principalement français; le prototype n’a pas reçu de revue d’accessibilité complète.
9. **Distribution** : signature debug uniquement. L’APK n’est pas prête pour Play Store ou un usage public.
10. **Build Android** : Flutter 3.47.5 signale que le projet et `flutter_timezone` utilisent encore le plugin Kotlin Gradle traditionnel; le build présent fonctionne, mais il faudra migrer vers Kotlin intégré ou une version de plugin compatible lors d’une future mise à jour Flutter.

## Vérifications manuelles avant pilote

- [ ] Installer et lancer sur des appareils Android physiques API 24+ et API 33+.
- [ ] Essayer les parcours cycle, conception, grossesse et « comprendre mon corps » du début à la fin.
- [ ] Vérifier saisies improbables, dates passées/futures, cycles irréguliers et « pas assez de données ».
- [ ] Vérifier la priorité de la date obstétricale confirmée si les dates se contredisent.
- [ ] Vérifier les notifications autorisées/refusées, la mise en veille et le redémarrage Android.
- [ ] Vérifier que l’application reste utile sans connexion et que le chat n’envoie pas de message avant acceptation.
- [ ] Vérifier le contenu exact du payload à l’aide des journaux de test du serveur avant le pilote, sans données réelles de santé.
- [ ] Tester export JSON/CSV et effacement; confirmer qu’aucune trace de base ni de clé ne reste dans le flux d’effacement.
- [ ] Tester mode sombre, taille de police accrue, TalkBack, contraste et traduction.
- [ ] Obtenir revue médicale, juridique/confidentialité et linguistique avant la distribution publique.
- [ ] Configurer une signature release dédiée; stocker les secrets hors du dépôt; auditer les dépendances natives.

## Critères de publication

Ne pas publier ni présenter Né comme une application de santé certifiée tant que le contenu clinique, les données, les calculs, le serveur Anoushka, le consentement, la sécurité Android, l’accessibilité et la signature de publication ne sont pas revus par les personnes compétentes.
