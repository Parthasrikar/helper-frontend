import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon'
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SidebarLink {
  label: string;
  path: string;
  icon: string;
}

interface SidebarData {
  [key: string]: SidebarLink[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  sidebarData: SidebarData = {
  "Resident Management": [
    { label: 'Fosts', path: '/dashboard/fosts', icon: 'group' },
    { label: 'Helpdesk Setup', path: '/dashboard/helpdesk-setup', icon: 'settings' },
    { label: 'Helpdesk Tickets', path: '/dashboard/helpdesk-tickets', icon: 'support' },
    { label: 'Renovation Works', path: '/dashboard/renovation-works', icon: 'construction' },
    { label: 'Violation Setup', path: '/dashboard/violation-setup', icon: 'gavel' },
    { label: 'Violation Tickets', path: '/dashboard/violation-tickets', icon: 'report' },
    { label: 'Amenities', path: '/dashboard/amenities', icon: 'event' }
  ],
  "Staff Management": [
    { label: 'Roles & Departments', path: '/dashboard/roles-departments', icon: 'badge' },
    { label: 'Staff Directory', path: '/dashboard/staff-directory', icon: 'contacts' },
    { label: 'Helpers', path: '/dashboard/helpers', icon: 'person' }
  ],
  "Work Management": [
    { label: 'Assets', path: '/dashboard/assets', icon: 'inventory' },
    { label: 'Locations', path: '/dashboard/locations', icon: 'place' },
    { label: 'Work Packages', path: '/dashboard/work-packages', icon: 'work' },
    { label: 'Work Scheduler', path: '/dashboard/work-scheduler', icon: 'schedule' },
    { label: 'Work Logs', path: '/dashboard/work-logs', icon: 'assignment' },
    { label: 'Issues', path: '/dashboard/issues', icon: 'bug_report' }
  ]
};


  get departmentKeys() {
    return Object.keys(this.sidebarData);
  }
}
