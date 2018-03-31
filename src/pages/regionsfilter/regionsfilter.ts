import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { CountryService } from '../../providers/service.country';
import { Logger, Analytics } from 'aws-amplify';

const logger = new Logger('Regionsfilter'); 

@Component({
  selector: 'page-regionsfilter',
  templateUrl: 'regionsfilter.html',
})
export class RegionsfilterPage {

  countries: Array<any>;

  // filters
  continent: { label: string, value: string };  
  country: any;
  limit: number;
  sort: string;

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              public countryService: CountryService) {

                this.continent = navParams.get("continent");
                this.country = navParams.get("country");
                this.limit = navParams.get("limit");
                this.sort = navParams.get("sort");
                this.getCountries();            
  }

  private getCountries(){
    this.countryService.getCountries(this.continent.value).subscribe(
      (countries) => {
        this.countries = countries;
      },
      (error) =>{
        logger.error(error);
        Analytics.record('Error', error);
      }
    );
  }

  dismiss(){

    Analytics.record('RegionsFilter', {
      continent: this.continent.value,
      country: this.country,
      limit: this.limit.toString(),
      sort: this.sort,
    });

    this.viewCtrl.dismiss({
      continent: this.continent,
      country: this.country,
      limit: this.limit,
      sort: this.sort,
  });
  }
}
