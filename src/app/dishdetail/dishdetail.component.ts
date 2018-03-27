import { Component, OnInit, Input } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import 'rxjs/add/operator/switchMap';
import { Feedback } from '../shared/feedback';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;

  dishdetails: Dish;
  dishIds: number[];
  prev: number;
  next: number;

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) {
      this.createForm();
    }

  ngOnInit() {
    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
      .subscribe(dishdetails => {this.dishdetails = dishdetails; this.setPrevNext(dishdetails.id)});
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack():  void {
    this.location.back();
  }
 
  formErrors = {
    'author': '',
    'comment': ''
  };
  

  validationMessages = {
    'author': {
      'required': 'Author is required',
      'minlength': 'Author must be at least 2 characters long'
    },
    'comment': {
      'required': 'Comment is required'
    }  
  };  

  createForm() {
    this.feedbackForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: 5,
      comment: ['', Validators.required]
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages    
  }
  
  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }

    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }

  }
  
  onSubmit() {
    this.feedback = this.feedbackForm.value;
    var newDishdetail = {
      "author": this.feedback["author"],
      "rating": this.feedback["rating"],
      "comment": this.feedback["comment"],
      "date": new Date().toISOString()
    }
    this.dishdetails.comments.push(newDishdetail);
    
    this.feedbackForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
  }

}
