type TokenEntry = {
    token: string;
    en: string;
    de: string;
    [key: string]: string; // Allows additional language properties
};

class TokenLibrary {
    private lang: string;
    private tokens: TokenEntry[];

    constructor(lang: string = 'de') {
        this.lang = lang;
        this.tokens = [
            { token: 'fotos', en: 'Photos', de: 'Bilder' },
            { token: 'back', en: 'back', de: 'zurück' },
            { token: 'riskAssessment', en: 'Risk Assessment', de: 'Gefährdungsbeurteilung' },           
            { token: 'close', en: 'close', de: 'schließen' },
            { token: 'cancel', en: 'cancel', de: 'abbrechen' },
            { token: 'settings', en: 'Settings', de: 'Einstellungen' },
            { token: 'projectOverview', en: 'Project Overview', de: 'Projektübersicht' },
            { token: 'menu', en: 'Menu', de: 'Menü' },
            { token: 'select', en: 'select', de: 'auswählen' },
            { token: 'context', en: 'Context', de: 'Kontext' },
            { token: 'description', en: 'Description', de: 'Beschreibung' },
            { token: 'edit', en: 'edit', de: 'bearbeiten' },
            { token: 'saveProject', en: 'save project', de: 'projekt speichern' },
            { token: 'editProject', en: 'change project', de: 'projekt editieren' },
            { token: 'account', en: 'Account', de: 'Konto' },
            { token: 'editHazard', en: 'edit hazard', de: 'Gefahr editieren' },
            { token: 'evaluateTask', en: 'create analysis task', de: 'Analyse erstellen' },
            { token: 'reEval', en: 'Revaluation', de: 'Neubewertung' },
            { token: 'projects', en: 'projects', de: 'projekte' },
            { token: 'createNewProject', en: 'create new Project', de: 'neues Projekt erstellen' },
            { token: 'allProjects', en: 'click on a project to view the results and overview.', de: 'Klicken Sie auf ein Projekt, um die Ergebnisse und die Übersicht anzuzeigen.' },         
            { token: 'noResults', 
                en: 'No more results available. Take additional photos for instant, one-click risk analysis.',
                de: 'Keine weiteren Ergebnisse verfügbar. Machen Sie zusätzliche Fotos für eine sofortige, automatisierte Risikoanalyse mit nur einem Klick.'
            },
            { token: 'noResult', 
                en: 'No more results available. Take additional photos for instant, one-click risk analysis.',
                de: 'Es sind noch keine Ergebnisse verfügbar. Updates sind auf dem Weg'
            },
            { token: 'newProject', 
                en: 'Upload your photos for one-click automated risk analysis. Get valuable insights and generate comprehensive reports instantly', 
                de: 'Laden Sie Ihre Fotos für eine automatische Risikoanalyse mit nur einem Klick hoch. Erhalten Sie wertvolle Einblicke und erstellen Sie sofort umfassende Berichte'
            },
            { token: 'btn_newProject', en: 'create new Project', de: 'neues Projekt erstellen' },
        ];
    }

    // Method to set the language
    public setLanguage(newLang: string): void {
        this.lang = newLang;
    }

    // Method to retrieve the text for a specific token
    public getToken(token: string): string {
        const tokenObj = this.tokens.find(t => t.token === token);

        // If token is not found or the language is not available, return a default message
        if (!tokenObj || !tokenObj[this.lang]) {
            console.warn(`Token "${token}" not found or language "${this.lang}" not available.`);
            return token;
        }

        // Return the text for the specified language
        return tokenObj[this.lang];
    }
}

export default TokenLibrary;
