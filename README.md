# VillaNova

## Présentation

VillaNova est une application web permettant de consulter des événements culturels grâce à l'API OpenAgenda.

L'utilisateur peut rechercher des événements, les filtrer par catégorie et consulter leurs détails sur une page dédiée.

Ce projet a été réalisé dans le cadre de ma formation en Bachelor IT à La Plateforme Marseille.



## Fonctionnalités

* Affichage des événements depuis l'API OpenAgenda
* Recherche d'événements
* Filtrage par catégorie
* Pagination des résultats
* Consultation du détail d'un événement
* Affichage des informations pratiques (date, heure, lieu)
* Responsive design (mobile et desktop)



## Technologies utilisées

* HTML5
* SCSS
* JavaScript
* API OpenAgenda
* Git / GitHub



## Structure du projet


VillaNova
│
├── index.html
├── event-detail.html
│
├── js
│   ├── main.js
│   └── detail.js
│
├── scss
│   └── style.scss
│
└── images




## Pages

### Page d'accueil

La page d'accueil affiche les événements récupérés depuis l'API OpenAgenda.

L'utilisateur peut :

* rechercher un événement ;
* filtrer les résultats ;
* naviguer entre les pages.

### Page détail

La page détail affiche :

* le titre de l'événement ;
* son image ;
* sa description complète ;
* les informations pratiques ;
* le lien de réservation lorsqu'il est disponible.



## Installation

1. Cloner le dépôt :

bash
git clone https://github.com/moinahalima-abdou/VillaNova.git


2. Ouvrir le dossier du projet.

3. Lancer le projet avec Live Server.



## Gestion des branches

Le projet a été développé avec plusieurs branches Git :

* feature-index
* feature-event-detail
* feature-scss
* feature-js
* feature-api
* feature-images

Les branches ont ensuite été fusionnées dans la branche principale `main`.



## Auteur

Moina Halima Abdou Doukeini

Bachelor IT - La Plateforme Marseille

