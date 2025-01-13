#!/bin/bash

# Paramètres à saisir
TASK_ID=$1  # Numéro de tâche Notion (ex: AF-XX)
COMMIT_MESSAGE=$2  # Message de commit (ex: "Ajout d'une fonctionnalité")

if [ -z "$TASK_ID" ] || [ -z "$COMMIT_MESSAGE" ]; then
    echo "Usage: ./automate.sh <TASK_ID> <COMMIT_MESSAGE>"
    exit 1
fi

# Nom de la branche de la tâche
BRANCH_NAME="task/${TASK_ID}"

# Nom de la branche feature principale
BASE_BRANCH="feature/testing"

# Étape 1 : Créer une nouvelle branche à partir de la branche feature/testing
echo "Création de la branche $BRANCH_NAME à partir de $BASE_BRANCH..."
git checkout $BASE_BRANCH || { echo "Erreur : Impossible de passer à la branche $BASE_BRANCH"; exit 1; }
git pull origin $BASE_BRANCH
git checkout -b "$BRANCH_NAME" || { echo "Erreur : Impossible de créer la branche $BRANCH_NAME"; exit 1; }

# Étape 2 : Dev manuel - Interruption pour permettre le travail
echo "Développement en cours sur la branche $BRANCH_NAME..."
read -p "Appuyez sur Entrée après avoir terminé vos modifications..."

# Étape 3 : Commit avec le message spécifié
echo "Création du commit..."
git add .
git commit -m "[${TASK_ID}] : ${COMMIT_MESSAGE}" || { echo "Erreur : Commit échoué"; exit 1; }

# Étape 4 : Push de la branche et création de la PR
echo "Push de la branche sur le dépôt distant..."
git push -u origin "$BRANCH_NAME" || { echo "Erreur : Push échoué"; exit 1; }

echo "Création de la Pull Request..."
gh pr create --title "[${TASK_ID}] : ${COMMIT_MESSAGE}" --body "" --base $BASE_BRANCH --head "$BRANCH_NAME" || { echo "Erreur : Création de la PR échouée"; exit 1; }

# Étape 5 : Fusionner la PR
echo "Fusion de la Pull Request..."
gh pr merge --auto --delete-branch || { echo "Erreur : Fusion échouée"; exit 1; }

# Étape 6 : Synchronisation de la branche feature/testing
echo "Suppression de la branche locale..."
git checkout $BASE_BRANCH
git pull origin $BASE_BRANCH
git branch -d "$BRANCH_NAME" || { echo "Erreur : Suppression locale échouée"; exit 1; }

echo "Processus terminé avec succès !"
