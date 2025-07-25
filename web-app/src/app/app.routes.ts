import { Routes } from '@angular/router';
import { StreamsComponent } from './pages/main-pages/streams/streams.component';
import { SplashComponent } from './pages/splash/splash.component';
import { LoginComponent } from './pages/auth-pages/login/login.component';
import { MapsComponent } from './pages/main-pages/maps/maps.component';

export const routes: Routes = [
    { path: '', redirectTo: 'splash', pathMatch: 'full' },
    { path: 'splash', component: SplashComponent },
    { path: 'login', component:  LoginComponent},
    { path: 'streams', component: StreamsComponent },
    { path: 'maps', component: MapsComponent },
];
