# Né — décisions de produit du MVP

Document de cadrage du prototype Flutter Android, consolidé le 1 octobre 2026. Cette note distingue les comportements réellement présents des éléments qui attendent encore une validation avant diffusion publique.

## Parcours et profils

L’onboarding illustré demande un seul objectif principal : suivre ses règles, tomber enceinte, suivre une grossesse ou comprendre son corps. Il comprend un accueil animé par une fleur dessinée à la main, une sélection d’objectif illustrée, un avertissement sensible lorsqu’un parcours touche à la fertilité ou à la grossesse, un pseudo facultatif, un engagement facultatif par maintien du doigt et une préférence de langue. Le pseudo, modifiable plus tard dans le profil, remplace l’adresse générique dans l’accueil.

L’interface du prototype est en français. Les choix Mooré et Dioula restent visibles comme langues en préparation, mais ne sont pas activés car aucune traduction relue par des locuteurs n’a été livrée. La communauté et les fonctionnalités communautaires sont hors MVP; elles pourront être étudiées ensuite avec des règles de modération et de protection adaptées.

## Suivi du cycle et fertilité

Les dates de règles, durées de cycle et notes sont enregistrées localement. Le calendrier distingue les dates consignées, les règles estimées, la fenêtre fertile estimée et les rendez-vous.

L’estimation utilise les intervalles réellement mesurés entre les dates successives de début de règles, avec davantage de poids sur les cycles les plus récents et une exclusion simple de valeurs aberrantes lorsque l’échantillon le permet. La durée habituelle choisie par l’utilisatrice ne sert qu’au repère provisoire lorsqu’une seule date est enregistrée; elle n’est jamais comptée comme observation. L’indicateur de fiabilité est volontairement prudent : moins de trois intervalles observés donnent « pas assez de données »; une fiabilité haute exige au moins six intervalles et une faible dispersion. Le nombre d’intervalles effectivement mesurés reste affiché. Le prototype ne déclare jamais une ovulation confirmée et avertit que les estimations ne sont pas une contraception.

Cette méthode est une heuristique de prototype, pas un outil clinique validé. Sa formulation, ses seuils et son utilité doivent être relus par des spécialistes avant toute mise en production.

## Grossesse et rendez-vous

Le parcours grossesse calcule un âge gestationnel informatif à partir de la date prévue confirmée par un professionnel lorsqu’elle est disponible; sinon, il estime à partir de la date des dernières règles. Les deux dates peuvent être enregistrées. La source de calcul est affichée et les dates peuvent être modifiées.

Le tableau de bord présente la semaine et le nombre de jours dans la semaine, la date prévue et un accès interactif à une trame calendaire de 42 semaines. La semaine courante est mise en avant; les autres semaines sont consultables. Les repères de chaque semaine sont organisationnels (questions à poser, rendez-vous à suivre), sans conseils cliniques non validés. Les informations détaillées sur le développement, les symptômes et les soins par semaine ne sont pas encore livrées; elles doivent être rédigées ou relues par une équipe qualifiée avant d’être ajoutées.

Les rendez-vous — date, heure, titre, lieu, note — sont conservés localement et peuvent produire un rappel local discret. La précision dépend d’Android, de l’autorisation de notification, des réglages d’économie d’énergie et des alarmes inexactes du système.

## Anoushka — données et consentement

La fondatrice a choisi `https://anoushka.onrender.com` pour le MVP. Le client cible `POST /api/chat` et le contrat observé de la page publique (`message`, `session_id`, réponse `reponse`, source facultative). L’API n’a pas été appelée pour tester une vraie question.

Avant le premier message de chaque conversation, l’interface explique que le texte saisi et un identifiant aléatoire éphémère seront transmis par Internet à Render et aux services utilisés par ce serveur. La conversation est conservée en mémoire sur la page de l’application et n’est pas ajoutée à la base Né. Aucun pseudo, objectif, date de cycle, date de grossesse ou rendez-vous n’est inclus automatiquement. L’identifiant est renouvelé lorsqu’une nouvelle conversation est ouverte. Les envois exigent un geste de l’utilisatrice, après acceptation explicite.

La saisie elle-même peut néanmoins contenir une information de santé ou un identifiant que l’utilisatrice écrit volontairement. L’application conseille de ne pas saisir de nom, numéro de téléphone ou détail identifiant. Les règles de conservation, l’accès, le traitement par le fournisseur de modèle et les conditions d’Anoushka/Render n’ont pas été audités. L’accord d’utilisation technique ne vaut pas certification de confidentialité ou de qualité médicale.

Aucune clé secrète n’est intégrée au client. Aucun message, profil ou date ne doit être envoyé automatiquement ou ajouté à la requête sans décision distincte.

## Confidentialité locale et contrôle utilisateur

Les données structurées résident dans SQLite chiffré par SQLCipher; la clé aléatoire est gardée dans le stockage sécurisé Android. Les sauvegardes automatiques Android sont désactivées afin de ne pas séparer la base chiffrée de sa clé. Les notifications utilisent un texte discret. Les exports JSON/CSV ne sont créés et partagés qu’après une action et un choix de l’utilisatrice. Les données exportées hors de Né ne peuvent pas être supprimées par l’application.

L’écran Profil permet de changer le pseudo et l’objectif, basculer les thèmes rose pâle/blanc et rose foncé/noir doux, choisir le français, activer les rappels, exporter les données et confirmer deux fois l’effacement local complet.

## Contenu et sécurité santé

Les articles actuellement inclus sont des textes de démonstration, conçus pour expliquer les limites des estimations et orienter vers les professionnels de santé. Ils sont signalés comme devant être relus et adaptés au contexte local. Ils ne constituent ni un corpus clinique approuvé ni une aide au diagnostic.

Anoushka est nommée explicitement comme IA. L’application répète qu’elle ne remplace pas une professionnelle de santé. Toute réponse de modèle doit être considérée comme non vérifiée; le produit final devra prévoir une gouvernance éditoriale, des consignes de sécurité et des voies d’escalade appropriées.
