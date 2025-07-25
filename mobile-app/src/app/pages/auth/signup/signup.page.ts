import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  fullName: string = '';

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  isFormValid(): boolean {
    return !!(
      this.fullName.trim() &&
      this.email.trim() &&
      this.password.trim() &&
      this.confirmPassword.trim() &&
      this.password === this.confirmPassword &&
      this.email.includes('@') &&
      this.password.length >= 6
    );
  }

  async onSignup() {
    if (!this.isFormValid()) {
      this.showToast('Please fill all fields correctly', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showToast('Passwords do not match', 'danger');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creating account...',
    });
    await loading.present();

    try {
      const result = await this.authService.signup({
        fullName: this.fullName,
        email: this.email,
        password: this.password
      });

      await loading.dismiss();

      if (result.success) {
        this.showToast('Account created successfully!', 'success');
        this.navCtrl.navigateRoot('/tabs', { animated: false });
      } else {
        this.showToast(result.message || 'Signup failed', 'danger');
      }
    } catch (error) {
      await loading.dismiss();
      this.showToast('An error occurred during signup', 'danger');
      console.error('Signup error:', error);
    }
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
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
