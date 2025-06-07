# Validation avec Zod - Formulaire de Listing de Dossard

Ce document explique l'implémentation de la validation avec Zod pour le formulaire de listing de dossard.

## Structure des fichiers

### `/schemas.ts`
Contient le schéma Zod partagé entre client et serveur :
- `BibFormSchema` : Schéma principal avec validation des champs et règles conditionnelles
- `BibFormData` : Type TypeScript inféré du schéma

### `/actions.ts` (Server-side)
Action serveur qui :
1. Extrait les données du FormData
2. Valide avec le schéma Zod
3. Redirige avec messages d'erreur si validation échoue
4. Crée le dossard si validation réussit

### `/client.tsx` (Client-side)
Composant client qui :
1. Valide les champs en temps réel
2. Affiche les erreurs spécifiques par champ
3. Met à jour l'état du formulaire de manière réactive

## Règles de validation

### Champs obligatoires
- `registrationNumber` : Numéro d'inscription (string non vide)
- `price` : Prix de vente (nombre positif)

### Champs optionnels
- `originalPrice` : Prix original (nombre)
- `gender` : Genre (enum: 'female', 'male', 'unisex')
- `size` : Taille (string)

### Validation conditionnelle
Le schéma utilise `.refine()` pour implémenter une logique conditionnelle :

**Si `isNotListedEvent = true`** :
- `unlistedEventName` devient requis
- `unlistedEventDate` devient requis
- `unlistedEventLocation` devient requis
- `eventId` doit être vide

**Si `isNotListedEvent = false`** :
- `eventId` devient requis
- Les champs `unlisted*` sont ignorés

## Validation côté client

### État du formulaire
```typescript
const [formData, setFormData] = useState<Partial<BibFormData>>({
  isNotListedEvent: false,
  price: 0,
})
const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
```

### Validation en temps réel
```typescript
const validateField = (name: string, value: any) => {
  const testData = { ...formData, [name]: value }
  const result = BibFormSchema.safeParse(testData)
  // Mise à jour des erreurs spécifiques
}
```

### Gestionnaire de changement
```typescript
const handleFieldChange = (name: string, value: any) => {
  setFormData(prev => ({ ...prev, [name]: value }))
  validateField(name, value)
}
```

## Validation côté serveur

### Extraction des données
```typescript
const formDataToValidate = {
  registrationNumber: formData.get('registrationNumber') as string,
  price: priceStr ? parseFloat(priceStr) : 0,
  // ... autres champs
}
```

### Validation avec gestion d'erreurs
```typescript
const validationResult = BibFormSchema.safeParse(formDataToValidate)

if (!validationResult.success) {
  const errorMessages = validationResult.error.errors.map(err => err.message).join(', ')
  redirect(`/dashboard/seller/list-bib?error=${encodeURIComponent(errorMessages)}`)
  return
}
```

## Messages d'erreur

Les messages d'erreur sont en français et sont affichés :
1. **Côté client** : Sous chaque champ en temps réel
2. **Côté serveur** : En haut du formulaire après soumission

### Styles des erreurs
```typescript
fieldError: { fontSize: '0.85em', marginTop: '5px', color: 'red' }
```

## Avantages de cette implémentation

1. **Validation unifiée** : Un seul schéma pour client et serveur
2. **Type safety** : Types TypeScript automatiquement générés
3. **UX améliorée** : Validation en temps réel côté client
4. **Sécurité** : Validation serveur obligatoire
5. **Maintenabilité** : Schéma centralisé et réutilisable
6. **Logique complexe** : Support des validations conditionnelles

## Extension future

Pour ajouter de nouveaux champs ou règles :
1. Modifier le schéma dans `schemas.ts`
2. Ajouter les champs dans le formulaire `client.tsx`
3. La validation côté serveur sera automatiquement mise à jour
