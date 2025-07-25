import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  async onLogin() {
    if (!this.email.trim() || !this.password.trim()) {
      this.showToast('Please enter email and password', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Signing in...',
    });
    await loading.present();

    try {
      const result = await this.authService.login(this.email, this.password);
      
      await loading.dismiss();

      if (result.success) {
        this.showToast('Welcome back!', 'success');
        this.navCtrl.navigateRoot('/tabs', { animated: false });
      } else {
        this.showToast(result.message || 'Invalid email or password', 'danger');
      }
    } catch (error) {
      await loading.dismiss();
      this.showToast('An error occurred during login', 'danger');
      console.error('Login error:', error);
    }
  }
  
  goToSignUp() {
    this.navCtrl.navigateForward('/signup');
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
