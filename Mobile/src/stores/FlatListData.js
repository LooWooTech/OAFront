import { observable, computed, action } from 'mobx'

export default class FlatListData {
    @observable loading = false
    @observable list = []
    @observable finished = false
    @observable page = 1
    @observable rows = 10
    asyncLoadData = null
    constructor(loadDataMethod, rows = 10) {
        this.asyncLoadData = loadDataMethod
        this.rows = rows
    }
    @action refreshData() {
        this.list = []
        this.finished = false
        this.page = 1
        this.loadData(1, this.rows)
    }
    @action async loadData(page) {
        this.loading = true;
        const shouldLoad = !this.finished && (this.list.length === 0 || page !== this.page)
        if (shouldLoad) {
            const data = await this.asyncLoadData(page, this.rows)
            if (data.Page.pageCount <= this.page) {
                this.finished = true;
            }
            this.page = data.Page.current
            this.list = this.list.concat(data.List)
        }
        this.loading = false;
        return this.list
    }

    @action async loadNextPageData() {
        return await this.loadData(this.page + 1)
    }
}