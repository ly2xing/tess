import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PlayerComponent } from './player/player.component';
import { HeaderComponent } from './components/header/header.component';
import { ControlsComponent } from './components/controls/controls.component';
import { VideoComponent } from './components/video/video.component';
import { FormsModule } from '@angular/forms';
import { SafePipe } from './pipes/safe.pipe';
import { CommonModule } from '@angular/common';
import { FileSelectorComponent } from './components/file-selector/file-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    HeaderComponent,
    ControlsComponent,
    VideoComponent,
    SafePipe,
    FileSelectorComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
