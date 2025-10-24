import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import { generateToken, verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === adminUsername && password === adminPassword) {
      const token = generateToken('admin');
      
      res.setHeader('Set-Cookie', `adminToken=${token}; HttpOnly; Path=/; Max-Age=86400`);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Login successful',
        token 
      });
    }

    const user = await User.findOne({ username, isActive: true });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    
    res.setHeader('Set-Cookie', `adminToken=${token}; HttpOnly; Path=/; Max-Age=86400`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: user.toJSON(),
      token 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
