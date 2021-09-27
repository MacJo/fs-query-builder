export interface timeline {
    start: string,
    end: string,
    departments?: Array<{name: string}>, 
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
    quote: Array<{value:string}>,
    file: Array<{value:string}>,
    folder: Array<{value:string}>,
    wildcard: Array<{value:string}>,
    minus: Array<{value:string}>,
    general: Array<{value:string}>
}

export interface fResponse {
    hits: Array<any>
}

export interface clientResponse {
    rCode?: number,
    message?: string
}

export interface updatedIndex {
    status: boolean,
    body?: {
        latestIndex?: string | undefined,
        latestADIndex?: string | undefined,
        latestDepartments?: string | undefined
    }
}
