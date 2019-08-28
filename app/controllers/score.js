const ScoreService = require('../services/score');

class ScoreController {
    async selectScore(req,res,next){
        const params = res.body;
        const result = await ScoreService.selectScore(params);
        res.send(result);
    }
}
module.exports = new ScoreController();
