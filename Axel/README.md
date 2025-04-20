# Axel

Axel est un outil CLI permettant de télécharger rapidement des fichiers depuis Internet en utilisant plusieurs connexions simultanées pour accélérer le processus. Il s'appuie sur l'utilitaire axel et propose une interface interactive en ligne de commande.

## Fonctionnalités principales

- Téléchargement rapide de fichiers via plusieurs connexions
- Interface interactive pour saisir l'URL et le nom du fichier de sortie
- Détection automatique de l'extension du fichier
- Gestion des erreurs et annulation du téléchargement

## Prérequis

- macOS ou Linux (Axel n'est pas disponible sur Windows)
- Bun js (version récente recommandée)
- Axel (installé automatiquement si absent sur macOS)

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/FeuGuillaume186/CLIs.git
   cd CLIs/Axel
   ```
2. Installez les dépendances :
   ```bash
   bun install
   ```
3. Builder le projet et ajout du symlink :
   ```bash
   ./build
   ```

## Utilisation

Lancez la commande suivante :

```bash
axl -n 4 # ou axl -n <nombre-de-connexions>
```

- Le nombre de connexions peut être modifié en spécifiant le paramètre `-n` suivi du nombre souhaité.
- Le paramètre `-n` est optionnel et prend la valeur par défaut de 4 si non spécifié.

Vous serez invité à saisir :

- L'URL du fichier à télécharger
- Le nom du fichier de sauvegarde (l'extension est proposée automatiquement)

Exemple :

```
? URL du fichier à télécharger : https://exemple.com/fichier.zip
? Nom du fichier de sauvegarde (extension par défaut : .zip) : monfichier
```

Le téléchargement démarre et une barre de progression s'affiche. Vous pouvez annuler à tout moment avec `Ctrl+C`.

## Configuration

- Le nombre de connexions simultanées peut être passé en argument (`-n`).
- L'outil vérifie la présence d'Axel et propose de l'installer via Homebrew si besoin.

## Dépendances

- [inquirer](https://www.npmjs.com/package/inquirer) : pour les prompts interactifs
- [ora](https://www.npmjs.com/package/ora) : pour l'affichage du spinner

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Auteurs

- thecatsupremay

## Licence

Ce projet est sous licence MIT.
