import decode from 'jwt-decode';
export default class AuthService {
    // Initializing important variables
    constructor(domain) { // API server domain
        this.fetch = this.fetch.bind(this) // React binding stuff
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
        this.state = {
            theUser : null
        }
    }

    login(username, password) {
        var theUser = {
            usernameOrEmail: username,
            password : password
        }
        return this.fetch(`/api/auth/signin`, {
            method: 'POST',
            body: JSON.stringify(theUser)
        }).then(res => {
            this.setToken(res.access_token) // Setting the token in localStorage
            return Promise.resolve(res);
        })
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        return this.fetch(`/api/getUser`, {
            method: 'GET'
        }).then(res => {
            this.profile = res;
            return Promise.resolve(res);
        })
    }

    getUserNames() {
        // Using jwt-decode npm package to decode the token
        return this.fetch(`/api/getUserNames`, {
            method: 'GET'
        }).then(res => {
            return Promise.resolve(res);
        })
    }

    createDraft(draft) {
        // Using jwt-decode npm package to decode the token
        return this.fetch(`/api/createDraft`, {
                method: 'POST',
                body: JSON.stringify(draft)
            }).then(res => {
                return Promise.resolve(res);
        })
    }

    getDrafts() {
        return this.fetch(`/api/getDrafts`, {
                method: 'GET'
            }).then(res => {
                return Promise.resolve(res);
        })
    }

    getDraftInfo(id) {
        return this.fetch(`/api/getDraftDetails/` + id, {
                method: 'GET'
            }).then(res => {
                return Promise.resolve(res);
        })
    }

    getUsersInDraft(id) {
        return this.fetch(`/api/getUsersInADraft/` + id, {
                method: 'GET'
            }).then(res => {
                return Promise.resolve(res);
    })
    }

    joinDraft(id) {
        return this.fetch(`/api/joinDraft/` + id, {
                method: 'POST'
            }).then(res => {
                return Promise.resolve(res);
        })
    }

    startDraft(id) {
        return this.fetch(`/api/startDraft/` + id, {
                method: 'POST'
            }).then(res => {
                return Promise.resolve(res);
        })
    }

    getRemainingPicks(id) {
        return this.fetch(`/api/getPicks/` + id, {
                method: 'GET'
            }).then(res => {
                return Promise.resolve(res);
    })
    }

    getPlayersRemaining(id) {
        return this.fetch(`/api/getPlayersRemaining/` + id, {
                method: 'GET'
            }).then(res => {
                return Promise.resolve(res);
        })
    }

    resumeDraft(id) {
        return this.fetch(`/api/resumeDraft/` + id, {
                method: 'POST'
            }).then(res => {
                return Promise.resolve(res);
    })
    }

    pickPlayer(id, pick) {
        return this.fetch(`/api/pickPlayer/` + id, {
                method: 'POST',
                body: JSON.stringify(pick)
            }).then(res => {
                return Promise.resolve(res);
        })
    }

    getPickHistory(id) {
        return this.fetch(`/api/getPickHistory/` + id, {
                method: 'GET'
            }).then(res => {
                return Promise.resolve(res);
        })
    }

    getPlayersDuringDraft(id) {
        return this.fetch(`/api/getPlayersDuringDraft/` + id, {
                method: 'GET'
            }).then(res => {
                return Promise.resolve(res);
        })
    }//getPlayersTeamDrafted

    getPlayersTeamDrafted(id, username) {
        return this.fetch(`/api/getPlayersTeamDrafted/` + id + '?user=' + username, {
                method: 'GET'
            }).then(res => {
                return Promise.resolve(res);
    })
    }//

    getNumberOfNotification() {
        return this.fetch(`/api/getNumberOfNotification/`, {
                method: 'GET'
            }).then(res => {
                return Promise.resolve(res);
    })
    }//

    getNotifications() {
        return this.fetch(`/api/getNotifications/`, {
                method: 'GET'
            }).then(res => {
                return Promise.resolve(res);
    })
    }

    deleteNotification(not) {
        return this.fetch(`/api/deleteNotification`, {
                method: 'POST',
                body: JSON.stringify(not)
            }).then(res => {
                return Promise.resolve(res);
    })
    }

    deleteDraft(id) {
        console.log(id)
        return this.fetch(`/api/deleteDraft/` + id, {
                method: 'GET'
            }).then(res => {
                return Promise.resolve(res);
    })
    }


    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}