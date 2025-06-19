# Event Creation Form - Refactorisation

Ce dossier contient le formulaire de création d'événements refactorisé pour une meilleure maintenabilité et lisibilité.

## Structure

Le formulaire monolithique de 745 lignes a été divisé en plusieurs composants logiques :

### Types et validation (`types.ts`)

- **EventCreationSchema** : Schéma de validation Zod avec toutes les règles de validation et les contraintes de dates
- **EventFormData** : Type inféré du schéma Zod
- **Translations** : Type pour les traductions
- **EventCreationFormProps** : Props du composant principal
- **EventSectionProps** : Props commune à toutes les sections

### Composants de sections

#### 1. `EventInformationSection.tsx`

Gère les informations de base de l'événement :

- Nom de l'événement
- Lieu
- Date
- Type (route, trail, triathlon, ultra)
- Description

#### 2. `EventDetailsSection.tsx`

Gère les détails de l'événement :

- Distance et dénivelé
- Prix officiel
- Nombre de participants
- Date limite de transfert
- URL du parcours
- URL d'inscription
- Upload de logo

#### 3. `BibPickupSection.tsx`

Gère les informations de retrait des dossards :

- Lieu de retrait
- Dates de début et fin de retrait

#### 4. `PartnershipSection.tsx`

Gère les paramètres de partenariat :

- Radio buttons pour événement partenaire ou non

#### 5. `EventOptionsSection.tsx`

Gère les options dynamiques de l'événement :

- Utilise `EventOptionCard` pour chaque option
- Permet d'ajouter/supprimer des options
- Gère les valeurs multiples par option

#### 6. `EventOptionCard.tsx`

Composant pour une option individuelle :

- Clé et libellé de l'option
- Champ requis ou optionnel
- Gestion des valeurs multiples
- Actions d'ajout/suppression

### Composant principal (`event-creation-form.tsx`)

Le composant principal orchestrant toutes les sections :

- Gestion du state du formulaire avec React Hook Form
- Validation avec Zod
- Logique de soumission
- Coordination entre toutes les sections
- Styles et layout global

## Avantages de la refactorisation

### ✅ Maintenabilité

- Code divisé en responsabilités claires
- Plus facile à déboguer et modifier
- Composants réutilisables

### ✅ Lisibilité

- Structure logique et intuitive
- Noms de fichiers explicites
- Séparation des préoccupations

### ✅ Testabilité

- Chaque composant peut être testé individuellement
- Mocking plus facile pour les tests unitaires

### ✅ Performance

- Possibilité d'optimisation individuelle
- React.memo() peut être appliqué aux sections

### ✅ Développement d'équipe

- Plusieurs développeurs peuvent travailler sur différentes sections
- Moins de conflits git
- Review de code plus facile

## Types et validation

La validation est centralisée dans `types.ts` avec Zod, incluant :

- Validation des types de base
- Validation des URLs
- Validation des nombres positifs
- Validation des relations entre dates
- Validation des fichiers

## Design préservé

L'interface utilisateur et l'expérience utilisateur restent identiques :

- Même layout et styles
- Même logique de validation
- Même comportement de soumission
- Même gestion des erreurs

## Migration

La migration s'est faite sans casser l'API :

- Même props d'entrée
- Même comportement de sortie
- Compatibilité totale avec le composant parent `AdminEventPageClient`

Ce refactoring améliore significativement la maintenabilité du code tout en préservant l'expérience utilisateur existante.
