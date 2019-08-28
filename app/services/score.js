let Service = require('./index');
class ScoreService extends Service{
    selectScore(params){
        return new Promise((resolve, reject) => {
            this.query('select * from score',[],(err,res)=>{
                err ? resolve(err) : resolve(res)
            });
        });
    }
}
module.exports = new ScoreService();