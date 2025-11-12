import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { UsersComponent } from '../users/users';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.html',
  styleUrl: './user-details.scss',
})
export class UserDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);

  id: string = '';

  user: any;


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log('ID recibido: ', this.id);

    this.apiService.getUser(this.id).subscribe((response) => {
      this.user = response.data;
      console.log('Usuario: ', this.user);
    })

  }



}
