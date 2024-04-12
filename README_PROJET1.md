### PROJET 1 - ENCHERES

* auteur : Barbara JOYEZ

## commandes pour executer le projet

1- Cloner le depot dans votre espace en effectuant :
```
git clone git@gitlab-etu.fil.univ-lille.fr:barbara.joyez.etu/jsfs-tp-barbarajoyez.git
```

2- Placez vous dans votre terminal au niveau jsfs-tp-barbarajoyez/encheres/client/ et effectuez :
```
npm install
``` 

3- Puis toujours dans jsfs-tp-barbarajoyez/encheres/client/ :
```
npm run build 
```

4- Placez vous maintenant dans votre terminal au niveau jsfs-tp-barbarajoyez/encheres/server/ et effectuez :
```
npm install 
```
5- Maintenant lancez le server avec la commande toujours au niveau jsfs-tp-barbarajoyez/encheres/server/ :
```
nodemon 
```
ou
```
npm run start
```

6- Pour ouvrir la premiere page sur le navigateur, ouvrez firefox et entrez dans la barre :
```
http://localhost:8080/
```

## informations sur la réalisation du projet 

#### ---- COMPORTEMENTS ---- :
Normalement tous les comportements du site enchères ont été gérés comme demandé. 

* auctioneer : 

Il peut commencer une enchère, juger une enchère et partir de l'enchere en cours. Il reçoit les propositions d'enchères et mets a jour le prix au fur et a mesure.

* bidder : 

Il peut rejoindre une enchère tant qu'elle n'est pas commencé sinon il attend le debut de la prochaine. Il peut enchérir avec les valeurs 5, 10 et 100 autant de fois qu'il veut. Il reçoit le prix mis a jour a chaque propositions des autres bidder. Une fois l'enchère terminé il reçoit si il a gagné ou non. 


#### ---- CODE ---- :

J'ai choisi de gérer les comportements en utilisant une seule balise dans le HTML, puis d'utiliser la méthode `innerText` dans mes fonctions pour mettre à jour dynamiquement le contenu de cette balise en fonction des actions de l'utilisateur ou des événements géré dans les différentes fonctions. J'ai utilisé cette pratique car je trouve que celà permet d'avoir moins de code, que se soit plus clair au niveau de la gestion du code et c'est plus facile pour modifier les comportements. 