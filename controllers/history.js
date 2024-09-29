const historyModel = require('../models/history');

const history = {
    history: async (req, moduleName, message, action) => {

        try {
   
            const history = await historyModel.create({
                module: moduleName,
                message: message,
                action: action,
                history_date: new Date()
            })
        } catch (error) {
            return res.status(500).json({ error: 'History failed: ' + error.message });
        }
    },

    getHistory: async (req, res, next) => {
        try {
            const allHistory = await historyModel.find({ is_delete: false }).sort({ createdOn: -1 }).exec();

            return res.json({ data: allHistory });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to fetch history: ' + error.message });
        }
    },
};

module.exports = history;
