// Fichier : lib/prediction.ts

export interface PredictionResult {
  dateEstimee: Date
  dateEstimeeFin: Date
  dureeEstimee: number
  dureeReglesEstimee: number
  ovulationEstimee: Date
  fenetreOvulationDebut: Date
  fenetreOvulationFin: Date
  fenetreFertileDebut: Date
  fenetreFertileFin: Date
  profil: 'regulier' | 'semi' | 'irregulier'
  sigma: number
  message: string
}

// Ajoute un nombre de jours à une date sans muter l'original
function ajouteJours(date: Date, jours: number): Date {
  const resultat = new Date(date)
  resultat.setDate(resultat.getDate() + jours)
  return resultat
}

// Calcule la moyenne simple d'un tableau de nombres
function moyenneSimple(valeurs: number[]): number {
  if (valeurs.length === 0) return 0
  return valeurs.reduce((acc, valeur) => acc + valeur, 0) / valeurs.length
}

// Filtre les cycles aberrants pour améliorer la précision
export function filtrerCyclesAberants(cycles: number[]): number[] {
  if (cycles.length < 4) return cycles

  const moyenne = moyenneSimple(cycles)
  const variance =
    cycles.reduce((acc, cycle) => acc + Math.pow(cycle - moyenne, 2), 0) / cycles.length
  const sigma = Math.sqrt(variance)

  return cycles.filter(cycle => Math.abs(cycle - moyenne) <= 2 * sigma)
}

// Calcule la moyenne pondérée des cycles en donnant plus de poids aux cycles récents
export function calculerMoyennePonderee(cycles: number[]): number {
  if (cycles.length === 0) return 28

  let numerateur = 0
  let denominateur = 0

  cycles.forEach((cycle, index) => {
    const poids = index + 1
    numerateur += cycle * poids
    denominateur += poids
  })

  return Math.round(numerateur / denominateur)
}

// Calcule l'écart-type standard des durées de cycle
export function calculerEcartType(cycles: number[]): number {
  if (cycles.length < 2) return 0

  const moyenne = moyenneSimple(cycles)
  const variance =
    cycles.reduce((acc, cycle) => acc + Math.pow(cycle - moyenne, 2), 0) / cycles.length

  return Math.sqrt(variance)
}

// Détermine le profil de régularité selon sigma
export function determinerProfil(sigma: number): 'regulier' | 'semi' | 'irregulier' {
  if (sigma <= 2) return 'regulier'
  if (sigma <= 5) return 'semi'
  return 'irregulier'
}

// Construit un message utilisateur adapté au profil de cycle
function construireMessage(profil: 'regulier' | 'semi' | 'irregulier'): string {
  if (profil === 'regulier') {
    return 'Tes règles sont prévues le jour estimé. Continue à enregistrer ton cycle.'
  }

  if (profil === 'semi') {
    return 'Ton cycle est semi-régulier. Les prédictions seront plus fiables si tu ajoutes encore des données.'
  }

  return 'Ton cycle est irrégulier. Continue d’enregistrer tes données pour améliorer la prédiction.'
}

// Calcule la durée moyenne des règles
export function calculerDureeRegles(dureeRegles: number[]): number {
  if (dureeRegles.length === 0) return 5
  return Math.round(moyenneSimple(dureeRegles))
}

/** 
//FONCTION PRINCIPALE
@param      //historique cycles
@param     // debut dernier cycle
@param    //historiqur durrée des regles 
@Returns  //REsultat de la prediction avec toute les dates et le profil 
*/
export function predire(
  cycles: number[],
  dernierDebut: Date,
  dureeRegles: number[] = []
): PredictionResult {

  //1.filtrer les cycles aberrants
    const cyclesFiltres = filtrerCyclesAberants(cycles)

    //2.durée et variabilité du cycle
    const dureeEstimee = calculerMoyennePonderee(cyclesFiltres)
    const sigma = calculerEcartType(cyclesFiltres)

    //3.Durée des règles
    const dureeReglesEstimee = calculerDureeRegles(dureeRegles)

    //Date estimée du prochain cycle
    const dateEstimee = ajouteJours(dernierDebut, dureeEstimee)
    const dateEstimeeFin = ajouteJours(dateEstimee, dureeReglesEstimee)

    //--OVULATION--
    //Règles biologiques
    const ovulationEstimee = ajouteJours(dateEstimee, -14)
    const fenetreOvulationDebut = ajouteJours(ovulationEstimee, -2) // 2jrs avant le pic
    const fenetreOvulationFin = ajouteJours(ovulationEstimee, +2) // 2jrs après le pic

    //--période fertile
    const fenetreFertileDebut = ajouteJours(ovulationEstimee, -5)
    const fenetreFertileFin = ajouteJours(ovulationEstimee, +1)

    // Profil
    const profil =
        sigma <= 2 ? 'regulier' :
        sigma <= 5 ? 'semi' :
        'irregulier'

  return {
    dateEstimee,
    dateEstimeeFin,
    dureeEstimee,
    dureeReglesEstimee,
    ovulationEstimee,
    fenetreOvulationDebut,
    fenetreOvulationFin,
    fenetreFertileDebut,
    fenetreFertileFin,
    profil,
    sigma: Math.round(sigma * 10) / 10,
    message: construireMessage(profil),
  }
}




/*
//EXEMPLE
const resultat = predire(
    [28, 30, 27, 29, 31],       //historique cycles
    new Date('2024-04-01'),    // debut dernier cycle
    [5, 4, 0, 5, 6]           //historiqur durrée des regles 
)

console.log(resultat.dateEstimee)
console.log(resultat.ovulationEstimee)
console.log(resultat.periodeFertile)
console.log(resultat.profil)
console.log(resultat.message)
*/



