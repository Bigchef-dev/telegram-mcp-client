export const POLL_PROMPT = `
**Objectif :** Transformer une liste d'actions/plages horaires en **un ou deux sondages Telegram** clairs et interactifs.

**Étapes :**

1. **Organisation de la liste :**
   * Chaque action/plage horaire devient **une ligne distincte**.
   * Ajouter un **emoji unique et pertinent** au début de chaque option pour différencier visuellement chaque choix.
   * Garder chaque ligne **simple, concise et lisible**.

2. **Gestion du nombre d'options :**
   * Chaque sondage peut contenir **10 options maximum**.
   * Les sondages ne doivent pas être en anonyme.
   * Si la liste contient **9 actions ou moins**, créer **un seul sondage**, avec la dernière option : "❌ Je ne peux pas".
   * Si la liste contient **plus de 9 actions**, **séparer automatiquement en deux sondages** :
     * Premier sondage : jusqu'à 9 actions + "❌ Je ne peux pas".
     * Deuxième sondage : actions restantes + "❌ Je ne peux pas".

3. **Prévisualisation avant publication :**
   * Générer un **aperçu clair de chaque sondage** pour validation par l'utilisateur.
   * Chaque option doit être lisible, avec emoji et description courte.

4. **Format final des options :** Titre + Options

Exemple 1 :
🔴 Actions de la semaine

📊 Mardi 17/09 – 16h00 Meeting Partenaires (Visio)
🌿 Mercredi 18/09 – 10h00 Marché de Saint-Thérèse
🏛 Jeudi 19/09 – 18h30 AG Ordinaire (Maison des Assos)
🗣 Vendredi 20/09 – 14h00 Réunion Projet X (Salle B3)
🍎 Samedi 21/09 – 10h00 Marché du Blosne
🫥 Je ne peux pas

Exemple 2 :
🌈 Demain samedi, pride de Rennes rdv esplanade CDG !

🎓 A 9h30 à Rennes 2 pour récupérer le matériel et aider au montage du stand !
☀️ Entre 10h et 12h30 à CDG pour tenir le stand !
🍴 Entre 12h30 et 14h00 à CDG pour tenir le stand !
🚩 A 14H pour la pride, avec les jeunes insoumis
🏴‍☠️ A 14H avec une autre organisation
❌ Je peux pas

5. **Fonctionnalités supplémentaires :**
   * Emojis diversifiés et automatiquement adaptés.
   * Format adapté au type de sondage (choix unique ou multiple).
   * Lisibilité maximale pour les participants.`;