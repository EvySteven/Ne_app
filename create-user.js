const { PrismaClient } = require('./lib/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser() {
  try {
    console.log('🔍 Vérification de la base de données...');
    
    // Vérifier si l'utilisateur existe déjà
    const email = 'somdaevysteven@gmail.com';
    const existingUser = await prisma.utilisatrice.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('✅ Utilisateur trouvé:', existingUser.pseudo);
      console.log('📧 Email:', existingUser.email);
      console.log('🆔 ID:', existingUser.id);
    } else {
      console.log('❌ Utilisateur non trouvé, création en cours...');
      
      // Créer l'utilisateur avec un mot de passe hashé
      const hashedPassword = await bcrypt.hash('votre-mot-de-passe', 12);
      
      const newUser = await prisma.utilisatrice.create({
        data: {
          email: email,
          pseudo: 'Steven',
          password: hashedPassword
        }
      });
      
      console.log('✅ Utilisateur créé avec succès!');
      console.log('📧 Email:', newUser.email);
      console.log('👤 Pseudo:', newUser.pseudo);
      console.log('🆔 ID:', newUser.id);
      console.log('🔑 Mot de passe hashé:', newUser.password.substring(0, 20) + '...');
    }
    
    // Lister tous les utilisateurs
    const allUsers = await prisma.utilisatrice.findMany();
    console.log('\n📋 Tous les utilisateurs dans la base:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.pseudo})`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
