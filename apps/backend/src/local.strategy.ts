
// import 'dotenv/config';
// import passport from "passport"
// var LocalStrategy = require('passport-local');
// import { prisma } from '@repo/db';



// export function setupLocalStrategy() {
//   passport.use(
//     new LocalStrategy(
//       {
//         email: "email",     // incoming field name for email
//         password: "password",  // incoming field name for password
//       },
//       async ({email, password, done} : {email : string, password : string, done : any}) => {

//         console.log("hi",email, password);
        
//         try {
//           // 1. Find user by email
//           const user = await prisma.user.findUnique({
//             where: { email },
//           });

//           if (!user) {
//             return done(null, false, { message: "User not found" });
//           }

//           // 2. Compare password
//           const isMatch = true

//           if (!isMatch) {
//             return done(null, false, { message: "Invalid credentials" });
//           }

//           // 3. Success – return user
//           return done(null, user);
//         } catch (err) {
//           return done(err);
//         }
//       }
//     )
//   );

//   // 4. Serialize user to session (store only ID)
//   passport.serializeUser((user: any, done) => {
//     done(null, user.id);
//   });

//   // 5. Deserialize user from ID
//   passport.deserializeUser(async (id: string, done) => {
//     try {
//       const user = await prisma.user.findUnique({ where: { id } });
//       done(null, user);
//     } catch (err) {
//       done(err);
//     }
//   });
// }