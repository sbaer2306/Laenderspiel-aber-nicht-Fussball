const saveGameToSession = (req, res, next) => {
    //access game data
    const game = res.game;

    //save game data in session
    req.session.game = game;

    //route handler
    next();
}

const retrieveGameFromSession = (req, res, next) => {
    const gameId = req.params.id;
    const game = req.session.game;
    req.game = game;
    next();
}

module.exports = {saveGameToSession, retrieveGameFromSession}