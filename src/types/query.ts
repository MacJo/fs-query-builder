export interface timeline {
    start: string,
    end: string,
    departments?: Array<string>, 
    archive: boolean
}

export interface query { 
    size: 100, 
    query: {} 
}

export interface queryBool { 
    bool: {} 
}

export interface queryMulti { 
    multi_match: {} 
}

export interface queryMust { 
    must: Array<any>
}

export interface queryMustNot { 
    must_not: Array<any> 
}

export interface queryShould { 
    should: Array<any>
}

export interface queryWild { 
    wildcard: {}
}

export interface postfilter {
    post_filter: {
        bool: {
            should: Array<any>,
            minimum_should_match?: 1
        }
    }
}

export interface user {
    username: string,
    password: string
}

export interface searchBody {
    quote: Array<any>,
    file: Array<any>,
    folder: Array<any>,
    wildcard: Array<any>,
    minus: Array<any>,
    general: Array<any>
}

export interface fResponse {
    hits: any
}

export interface clientResponse {
    rCode?: number | '000',
    message: any | '000'
}

export interface updatedIndex {
    status: boolean,
    body?: {
        latestIndex?: string | undefined,
        latestADIndex?: string | undefined,
        latestDepartments?: string | undefined
    }
}
