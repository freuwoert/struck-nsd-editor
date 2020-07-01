// Defaults
import Vue from 'vue'
import Vuex from 'vuex'

// Read / Write
//import Document from './modules/Document'
import Project from './modules/Project'
import UI from './modules/UI'

// Read only
import Structures from './modules/readonly/Structures'
import Software from './modules/readonly/Software'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        // Read / Write
        Project,
        UI,

        // Read only
        Software,
        Structures,
    }
})
