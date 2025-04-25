import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    CommonModule,
    DragDropModule
  ],
  providers: [ 
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient()
    // If you have interceptors, provide them here using withInterceptors:
    // provideHttpClient(withInterceptors([YourInterceptorClass]))
  ],
  bootstrap: [AppComponent],
})

export class AppModule {}
