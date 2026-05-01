const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration...\n');

// Vérifier si .env existe
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Fichier .env trouvé');
  
  // Lire le contenu
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
  
  console.log('\n📋 Variables d\'environnement requises :');
  requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}=`)) {
      console.log(`✅ ${varName}: configuré`);
    } else {
      console.log(`❌ ${varName}: MANQUANT`);
    }
  });
} else {
  console.log('❌ Fichier .env NON TROUVÉ');
  console.log('\n📝 Actions requises :');
  console.log('1. Créez un fichier .env à la racine du projet');
  console.log('2. Copiez le contenu depuis env-example.txt');
  console.log('3. Remplissez les valeurs avec vos identifiants Supabase');
  console.log('4. Redémarrez le serveur avec npm run dev');
}

console.log('\n🔧 Pour créer le fichier .env :');
console.log('cp env-example.txt .env');
console.log('Puis éditez .env avec vos vraies valeurs');
