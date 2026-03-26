import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

let users = [
    { id: '01',
    username: "irina",
    email: "irina01@gmail.com",
    password: await bcrypt.hash('password', 10),
    role: 'admin'
    },
    { id: '02',
    username: "user2",
    email: "user2@gmail.com",
    password: await bcrypt.hash('password', 10),
    role: 'user'
    }
]

const jwtSecret = process.env.JWT_SECRET 

app.get("/", (_, res) => {
  res.send("Server is running");
});

app.post('/login',async (req, res) => {
    const {email,password} = req.body

    try{
        const user = users.find((user) => user.email === email)
        if(!user){
            return res.status(404).json({
                message: 'User is not found'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({
                message: 'Incorrect password'
            })
        }

        const token = jwt.sign(
            {id: user.id, email: user.email, role: user.role},
            jwtSecret,
            {expiresIn: '1h'}
        )

        res.json({token})
    }catch(error){
        res.status(500).json({
            message: 'Server Error'
        })
    }
})

function authenticateJWT(req,res,next){
    const authHeader = req.headers.authorization

    if(authHeader && authHeader.startsWith('Bearer ')){
        const token = authHeader.substring(7, authHeader.length)

        jwt.verify(token, jwtSecret, (err,user) => {
            if(err){
                return res.status(403).json({
                    message: 'Forbidden: Invalid or expired token'
                })
        }

        req.user = user
                next()  
        })
    } else{
        return res.status(401).json({ message: 'No token provided'})
    }
}

function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        next();
    };
}

app.post('/update-email', authenticateJWT, (req,res) => {
    const { newEmail } = req.body;

     if (!newEmail) {
    return res.status(400).json({ message: 'New email is required' });
  }

  const user = users.find((user) => user.id === req.user.id);

if (!user) {
  return res.status(404).json({ message: "User not found" });
}

user.email = newEmail;

return res.json({
  message: "Email updated successfully",
  user,
});
})

app.post('/update-role', authenticateJWT, authorizeRole('admin'), (req,res) => {
    try {
        const { id, newRole } = req.body;

        if (!id || !newRole) {
            return res.status(400).json({
                message: 'User id and new role are required'
            });
        }

        const user = users.find((user) => user.id === id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        user.role = newRole;

        return res.json({
            message: 'Role updated successfully',
            user
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error'
        });
    }
})


app.post('/refresh-token', authenticateJWT, (req, res) => {
    try {
        const newToken = jwt.sign(
            { id: req.user.id, email: req.user.email, role: req.user.role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Token updated successfully',
            newToken
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error'
        });
    }
});



app.delete('/delete-account', authenticateJWT, (req,res) => {
    try {
        const user = users.find((user) => user.id === req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        users = users.filter((user) => user.id !== req.user.id);

        return res.json({
            message: 'Account deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error'
        });
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
