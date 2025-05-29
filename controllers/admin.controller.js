const User = require('../models/users.model')

const adminController = {
    register: async (req, res) => {
        try {
            let userInfo = res.body;
            


            
        } catch (error) {
            return res.status(500).json({ status: 500, error: error.message });
        }
    },
    login: async (req, res) => {
        try {
            let 
            
        } catch (error) {
            return res.status(500).json({ status: 500, error: error.message });
        }
    }
}