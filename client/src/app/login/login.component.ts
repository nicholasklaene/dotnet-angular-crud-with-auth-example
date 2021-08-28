import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    username: '',
    password: '',
  });

  loginMode = true;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.loginForm.status === 'INVALID') {
      console.log('Invalid'); // add error
      return;
    }
    const userCredentials = this.loginForm.value;
    const authenticateURL = this.loginMode
      ? 'https://localhost:44307/api/user/authenticate'
      : 'https://localhost:44307/api/user';

    try {
      let request = await fetch(authenticateURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userCredentials),
      });
      const data = await request.json();
      const status = request.status;

      if (status == 200) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);
        window.location.href = '/';
      }
    } catch (error) {
      console.log('Error authenticating', error);
    }
  }

  toggleMode() {
    this.loginMode = !this.loginMode;
  }
}
