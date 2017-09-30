import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { CountryService } from '../../providers/service.country';

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
        console.log(error);
      }
    );
  }

  dismiss(){
    this.viewCtrl.dismiss({
      continent: this.continent,
      country: this.country,
      limit: this.limit,
      sort: this.sort,
    });
  }
}
