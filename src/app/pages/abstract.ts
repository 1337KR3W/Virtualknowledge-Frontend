import { Directive, inject } from "@angular/core";
import { NavController, MenuController } from "@ionic/angular";
import { DataManagementService } from "../services/data-management.service";

@Directive()
export class AbstractPage {

    protected readonly nav = inject(NavController);
    protected readonly menuCtrl = inject(MenuController);
    protected readonly dataManagement = inject(DataManagementService);
    //protected readonly translateService = inject(TranslateService);

    public languages: { [key: string]: string } = {};

    constructor() { }

    public openCloseMenu() {
        this.menuCtrl.toggle('menu');
    }

    public navigateTo(page: string) {
        this.nav.navigateForward(page);
    }

    public navigateBack(page: string) {
        this.nav.navigateBack(page);
    }
}