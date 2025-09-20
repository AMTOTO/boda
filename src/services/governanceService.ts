interface AdministrativeUnit {
  code: string;
  name: string;
  level: number;
  parentCode?: string;
  country: string;
}

interface GovernanceHierarchy {
  country: string;
  levels: string[];
  units: AdministrativeUnit[];
}

class GovernanceService {
  private hierarchies: Record<string, GovernanceHierarchy> = {
    'KE': {
      country: 'Kenya',
      levels: ['County', 'Sub-County', 'Ward', 'Village'],
      units: [
        // Counties
        { code: 'KE-01', name: 'Baringo', level: 1, country: 'KE' },
        { code: 'KE-02', name: 'Bomet', level: 1, country: 'KE' },
        { code: 'KE-03', name: 'Bungoma', level: 1, country: 'KE' },
        { code: 'KE-04', name: 'Busia', level: 1, country: 'KE' },
        { code: 'KE-05', name: 'Elgeyo-Marakwet', level: 1, country: 'KE' },
        { code: 'KE-06', name: 'Embu', level: 1, country: 'KE' },
        { code: 'KE-07', name: 'Garissa', level: 1, country: 'KE' },
        { code: 'KE-08', name: 'Homa Bay', level: 1, country: 'KE' },
        { code: 'KE-09', name: 'Isiolo', level: 1, country: 'KE' },
        { code: 'KE-10', name: 'Kajiado', level: 1, country: 'KE' },
        { code: 'KE-11', name: 'Kakamega', level: 1, country: 'KE' },
        { code: 'KE-12', name: 'Kericho', level: 1, country: 'KE' },
        { code: 'KE-13', name: 'Kiambu', level: 1, country: 'KE' },
        { code: 'KE-14', name: 'Kilifi', level: 1, country: 'KE' },
        { code: 'KE-15', name: 'Kirinyaga', level: 1, country: 'KE' },
        { code: 'KE-16', name: 'Kisii', level: 1, country: 'KE' },
        { code: 'KE-17', name: 'Kisumu', level: 1, country: 'KE' },
        { code: 'KE-18', name: 'Kitui', level: 1, country: 'KE' },
        { code: 'KE-19', name: 'Kwale', level: 1, country: 'KE' },
        { code: 'KE-20', name: 'Laikipia', level: 1, country: 'KE' },
        { code: 'KE-21', name: 'Lamu', level: 1, country: 'KE' },
        { code: 'KE-22', name: 'Machakos', level: 1, country: 'KE' },
        { code: 'KE-23', name: 'Makueni', level: 1, country: 'KE' },
        { code: 'KE-24', name: 'Mandera', level: 1, country: 'KE' },
        { code: 'KE-25', name: 'Marsabit', level: 1, country: 'KE' },
        { code: 'KE-26', name: 'Meru', level: 1, country: 'KE' },
        { code: 'KE-27', name: 'Migori', level: 1, country: 'KE' },
        { code: 'KE-28', name: 'Mombasa', level: 1, country: 'KE' },
        { code: 'KE-29', name: 'Murang\'a', level: 1, country: 'KE' },
        { code: 'KE-30', name: 'Nairobi', level: 1, country: 'KE' },
        { code: 'KE-31', name: 'Nakuru', level: 1, country: 'KE' },
        { code: 'KE-32', name: 'Nandi', level: 1, country: 'KE' },
        { code: 'KE-33', name: 'Narok', level: 1, country: 'KE' },
        { code: 'KE-34', name: 'Nyamira', level: 1, country: 'KE' },
        { code: 'KE-35', name: 'Nyandarua', level: 1, country: 'KE' },
        { code: 'KE-36', name: 'Nyeri', level: 1, country: 'KE' },
        { code: 'KE-37', name: 'Samburu', level: 1, country: 'KE' },
        { code: 'KE-38', name: 'Siaya', level: 1, country: 'KE' },
        { code: 'KE-39', name: 'Taita-Taveta', level: 1, country: 'KE' },
        { code: 'KE-40', name: 'Tana River', level: 1, country: 'KE' },
        { code: 'KE-41', name: 'Tharaka-Nithi', level: 1, country: 'KE' },
        { code: 'KE-42', name: 'Trans Nzoia', level: 1, country: 'KE' },
        { code: 'KE-43', name: 'Turkana', level: 1, country: 'KE' },
        { code: 'KE-44', name: 'Uasin Gishu', level: 1, country: 'KE' },
        { code: 'KE-45', name: 'Vihiga', level: 1, country: 'KE' },
        { code: 'KE-46', name: 'Wajir', level: 1, country: 'KE' },
        { code: 'KE-47', name: 'West Pokot', level: 1, country: 'KE' },
        
        // Sample Sub-Counties for Kiambu
        { code: 'KE-13-01', name: 'Gatundu North', level: 2, parentCode: 'KE-13', country: 'KE' },
        { code: 'KE-13-02', name: 'Gatundu South', level: 2, parentCode: 'KE-13', country: 'KE' },
        { code: 'KE-13-03', name: 'Juja', level: 2, parentCode: 'KE-13', country: 'KE' },
        { code: 'KE-13-04', name: 'Thika Town', level: 2, parentCode: 'KE-13', country: 'KE' },
        { code: 'KE-13-05', name: 'Ruiru', level: 2, parentCode: 'KE-13', country: 'KE' },
        { code: 'KE-13-06', name: 'Limuru', level: 2, parentCode: 'KE-13', country: 'KE' },
        { code: 'KE-13-07', name: 'Kikuyu', level: 2, parentCode: 'KE-13', country: 'KE' },
        { code: 'KE-13-08', name: 'Kabete', level: 2, parentCode: 'KE-13', country: 'KE' },
        { code: 'KE-13-09', name: 'Kiambu', level: 2, parentCode: 'KE-13', country: 'KE' },
        { code: 'KE-13-10', name: 'Kiambaa', level: 2, parentCode: 'KE-13', country: 'KE' },
        { code: 'KE-13-11', name: 'Githunguri', level: 2, parentCode: 'KE-13', country: 'KE' },
        { code: 'KE-13-12', name: 'Lari', level: 2, parentCode: 'KE-13', country: 'KE' },
      ]
    },
    'UG': {
      country: 'Uganda',
      levels: ['Region', 'District', 'County', 'Sub-County', 'Parish', 'Village'],
      units: [
        // Regions
        { code: 'UG-C', name: 'Central Region', level: 1, country: 'UG' },
        { code: 'UG-E', name: 'Eastern Region', level: 1, country: 'UG' },
        { code: 'UG-N', name: 'Northern Region', level: 1, country: 'UG' },
        { code: 'UG-W', name: 'Western Region', level: 1, country: 'UG' },
        
        // Central Region Districts
        { code: 'UG-C-01', name: 'Kampala', level: 2, parentCode: 'UG-C', country: 'UG' },
        { code: 'UG-C-02', name: 'Wakiso', level: 2, parentCode: 'UG-C', country: 'UG' },
        { code: 'UG-C-03', name: 'Mukono', level: 2, parentCode: 'UG-C', country: 'UG' },
        { code: 'UG-C-04', name: 'Mpigi', level: 2, parentCode: 'UG-C', country: 'UG' },
        { code: 'UG-C-05', name: 'Luwero', level: 2, parentCode: 'UG-C', country: 'UG' },
        
        // Eastern Region Districts
        { code: 'UG-E-01', name: 'Jinja', level: 2, parentCode: 'UG-E', country: 'UG' },
        { code: 'UG-E-02', name: 'Mbale', level: 2, parentCode: 'UG-E', country: 'UG' },
        { code: 'UG-E-03', name: 'Soroti', level: 2, parentCode: 'UG-E', country: 'UG' },
        { code: 'UG-E-04', name: 'Tororo', level: 2, parentCode: 'UG-E', country: 'UG' },
        
        // Northern Region Districts
        { code: 'UG-N-01', name: 'Gulu', level: 2, parentCode: 'UG-N', country: 'UG' },
        { code: 'UG-N-02', name: 'Lira', level: 2, parentCode: 'UG-N', country: 'UG' },
        { code: 'UG-N-03', name: 'Arua', level: 2, parentCode: 'UG-N', country: 'UG' },
        
        // Western Region Districts
        { code: 'UG-W-01', name: 'Mbarara', level: 2, parentCode: 'UG-W', country: 'UG' },
        { code: 'UG-W-02', name: 'Kasese', level: 2, parentCode: 'UG-W', country: 'UG' },
        { code: 'UG-W-03', name: 'Hoima', level: 2, parentCode: 'UG-W', country: 'UG' },
      ]
    },
    'RW': {
      country: 'Rwanda',
      levels: ['Province', 'District', 'Sector', 'Cell', 'Village'],
      units: [
        // Provinces
        { code: 'RW-01', name: 'Kigali City', level: 1, country: 'RW' },
        { code: 'RW-02', name: 'Eastern Province', level: 1, country: 'RW' },
        { code: 'RW-03', name: 'Northern Province', level: 1, country: 'RW' },
        { code: 'RW-04', name: 'Southern Province', level: 1, country: 'RW' },
        { code: 'RW-05', name: 'Western Province', level: 1, country: 'RW' },
        
        // Kigali City Districts
        { code: 'RW-01-01', name: 'Nyarugenge', level: 2, parentCode: 'RW-01', country: 'RW' },
        { code: 'RW-01-02', name: 'Gasabo', level: 2, parentCode: 'RW-01', country: 'RW' },
        { code: 'RW-01-03', name: 'Kicukiro', level: 2, parentCode: 'RW-01', country: 'RW' },
        
        // Eastern Province Districts
        { code: 'RW-02-01', name: 'Nyagatare', level: 2, parentCode: 'RW-02', country: 'RW' },
        { code: 'RW-02-02', name: 'Gatsibo', level: 2, parentCode: 'RW-02', country: 'RW' },
        { code: 'RW-02-03', name: 'Kayonza', level: 2, parentCode: 'RW-02', country: 'RW' },
        { code: 'RW-02-04', name: 'Kirehe', level: 2, parentCode: 'RW-02', country: 'RW' },
        { code: 'RW-02-05', name: 'Ngoma', level: 2, parentCode: 'RW-02', country: 'RW' },
        { code: 'RW-02-06', name: 'Bugesera', level: 2, parentCode: 'RW-02', country: 'RW' },
        { code: 'RW-02-07', name: 'Rwamagana', level: 2, parentCode: 'RW-02', country: 'RW' },
        
        // Northern Province Districts
        { code: 'RW-03-01', name: 'Rulindo', level: 2, parentCode: 'RW-03', country: 'RW' },
        { code: 'RW-03-02', name: 'Gakenke', level: 2, parentCode: 'RW-03', country: 'RW' },
        { code: 'RW-03-03', name: 'Musanze', level: 2, parentCode: 'RW-03', country: 'RW' },
        { code: 'RW-03-04', name: 'Burera', level: 2, parentCode: 'RW-03', country: 'RW' },
        { code: 'RW-03-05', name: 'Gicumbi', level: 2, parentCode: 'RW-03', country: 'RW' },
        
        // Southern Province Districts
        { code: 'RW-04-01', name: 'Nyanza', level: 2, parentCode: 'RW-04', country: 'RW' },
        { code: 'RW-04-02', name: 'Gisagara', level: 2, parentCode: 'RW-04', country: 'RW' },
        { code: 'RW-04-03', name: 'Nyaruguru', level: 2, parentCode: 'RW-04', country: 'RW' },
        { code: 'RW-04-04', name: 'Huye', level: 2, parentCode: 'RW-04', country: 'RW' },
        { code: 'RW-04-05', name: 'Nyamagabe', level: 2, parentCode: 'RW-04', country: 'RW' },
        { code: 'RW-04-06', name: 'Ruhango', level: 2, parentCode: 'RW-04', country: 'RW' },
        { code: 'RW-04-07', name: 'Muhanga', level: 2, parentCode: 'RW-04', country: 'RW' },
        { code: 'RW-04-08', name: 'Kamonyi', level: 2, parentCode: 'RW-04', country: 'RW' },
        
        // Western Province Districts
        { code: 'RW-05-01', name: 'Karongi', level: 2, parentCode: 'RW-05', country: 'RW' },
        { code: 'RW-05-02', name: 'Rutsiro', level: 2, parentCode: 'RW-05', country: 'RW' },
        { code: 'RW-05-03', name: 'Rubavu', level: 2, parentCode: 'RW-05', country: 'RW' },
        { code: 'RW-05-04', name: 'Nyabihu', level: 2, parentCode: 'RW-05', country: 'RW' },
        { code: 'RW-05-05', name: 'Ngororero', level: 2, parentCode: 'RW-05', country: 'RW' },
        { code: 'RW-05-06', name: 'Rusizi', level: 2, parentCode: 'RW-05', country: 'RW' },
        { code: 'RW-05-07', name: 'Nyamasheke', level: 2, parentCode: 'RW-05', country: 'RW' },
      ]
    },
    'CD': {
      country: 'Eastern DRC',
      levels: ['Province', 'Territory', 'Sector/Chiefdom', 'Groupement', 'Village'],
      units: [
        // Eastern Provinces
        { code: 'CD-NK', name: 'North Kivu', level: 1, country: 'CD' },
        { code: 'CD-SK', name: 'South Kivu', level: 1, country: 'CD' },
        { code: 'CD-MA', name: 'Maniema', level: 1, country: 'CD' },
        { code: 'CD-IT', name: 'Ituri', level: 1, country: 'CD' },
        
        // North Kivu Territories
        { code: 'CD-NK-01', name: 'Goma', level: 2, parentCode: 'CD-NK', country: 'CD' },
        { code: 'CD-NK-02', name: 'Nyiragongo', level: 2, parentCode: 'CD-NK', country: 'CD' },
        { code: 'CD-NK-03', name: 'Masisi', level: 2, parentCode: 'CD-NK', country: 'CD' },
        { code: 'CD-NK-04', name: 'Walikale', level: 2, parentCode: 'CD-NK', country: 'CD' },
        { code: 'CD-NK-05', name: 'Lubero', level: 2, parentCode: 'CD-NK', country: 'CD' },
        { code: 'CD-NK-06', name: 'Beni', level: 2, parentCode: 'CD-NK', country: 'CD' },
        { code: 'CD-NK-07', name: 'Oicha', level: 2, parentCode: 'CD-NK', country: 'CD' },
        { code: 'CD-NK-08', name: 'Rutshuru', level: 2, parentCode: 'CD-NK', country: 'CD' },
        
        // South Kivu Territories
        { code: 'CD-SK-01', name: 'Bukavu', level: 2, parentCode: 'CD-SK', country: 'CD' },
        { code: 'CD-SK-02', name: 'Kabare', level: 2, parentCode: 'CD-SK', country: 'CD' },
        { code: 'CD-SK-03', name: 'Kalehe', level: 2, parentCode: 'CD-SK', country: 'CD' },
        { code: 'CD-SK-04', name: 'Uvira', level: 2, parentCode: 'CD-SK', country: 'CD' },
        { code: 'CD-SK-05', name: 'Fizi', level: 2, parentCode: 'CD-SK', country: 'CD' },
        { code: 'CD-SK-06', name: 'Mwenga', level: 2, parentCode: 'CD-SK', country: 'CD' },
        { code: 'CD-SK-07', name: 'Shabunda', level: 2, parentCode: 'CD-SK', country: 'CD' },
        
        // Maniema Territories
        { code: 'CD-MA-01', name: 'Kindu', level: 2, parentCode: 'CD-MA', country: 'CD' },
        { code: 'CD-MA-02', name: 'Kailo', level: 2, parentCode: 'CD-MA', country: 'CD' },
        { code: 'CD-MA-03', name: 'Pangi', level: 2, parentCode: 'CD-MA', country: 'CD' },
        { code: 'CD-MA-04', name: 'Punia', level: 2, parentCode: 'CD-MA', country: 'CD' },
        { code: 'CD-MA-05', name: 'Kasongo', level: 2, parentCode: 'CD-MA', country: 'CD' },
        { code: 'CD-MA-06', name: 'Kibombo', level: 2, parentCode: 'CD-MA', country: 'CD' },
        
        // Ituri Territories
        { code: 'CD-IT-01', name: 'Bunia', level: 2, parentCode: 'CD-IT', country: 'CD' },
        { code: 'CD-IT-02', name: 'Mahagi', level: 2, parentCode: 'CD-IT', country: 'CD' },
        { code: 'CD-IT-03', name: 'Djugu', level: 2, parentCode: 'CD-IT', country: 'CD' },
        { code: 'CD-IT-04', name: 'Irumu', level: 2, parentCode: 'CD-IT', country: 'CD' },
        { code: 'CD-IT-05', name: 'Mambasa', level: 2, parentCode: 'CD-IT', country: 'CD' },
      ]
    }
  };

  getCountries(): Array<{ code: string; name: string; flag: string; currency: string }> {
    return [
      { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES' },
      { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX' },
      { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF' },
      { code: 'CD', name: 'Eastern DRC', flag: '🇨🇩', currency: 'CDF' }
    ];
  }

  getAdministrativeUnits(countryCode: string, level: number = 1, parentCode?: string): AdministrativeUnit[] {
    const hierarchy = this.hierarchies[countryCode];
    if (!hierarchy) return [];

    return hierarchy.units.filter(unit => {
      if (unit.level !== level) return false;
      if (level === 1) return !unit.parentCode; // Top level units
      return unit.parentCode === parentCode; // Child units
    });
  }

  getHierarchyLevels(countryCode: string): string[] {
    return this.hierarchies[countryCode]?.levels || [];
  }

  validateAdministrativeCode(countryCode: string, unitCode: string): boolean {
    const hierarchy = this.hierarchies[countryCode];
    if (!hierarchy) return false;
    
    return hierarchy.units.some(unit => unit.code === unitCode);
  }

  getFullAdministrativePath(unitCode: string): AdministrativeUnit[] {
    const path: AdministrativeUnit[] = [];
    
    // Find the unit and traverse up the hierarchy
    for (const hierarchy of Object.values(this.hierarchies)) {
      const unit = hierarchy.units.find(u => u.code === unitCode);
      if (unit) {
        path.unshift(unit);
        
        // Traverse up to parent units
        let currentParent = unit.parentCode;
        while (currentParent) {
          const parentUnit = hierarchy.units.find(u => u.code === currentParent);
          if (parentUnit) {
            path.unshift(parentUnit);
            currentParent = parentUnit.parentCode;
          } else {
            break;
          }
        }
        break;
      }
    }
    
    return path;
  }

  formatLocationString(unitCodes: string[], includeCountry: boolean = true): string {
    const units: AdministrativeUnit[] = [];
    
    for (const code of unitCodes) {
      for (const hierarchy of Object.values(this.hierarchies)) {
        const unit = hierarchy.units.find(u => u.code === code);
        if (unit) {
          units.push(unit);
          break;
        }
      }
    }
    
    // Sort by level (village first, country last)
    units.sort((a, b) => b.level - a.level);
    
    let locationParts = units.map(unit => unit.name);
    
    if (includeCountry && units.length > 0) {
      const countryName = this.getCountries().find(c => c.code === units[0].country)?.name;
      if (countryName) {
        locationParts.push(countryName);
      }
    }
    
    return locationParts.join(', ');
  }

  // Auto-sync with government databases (mock implementation)
  async syncWithGovernmentData(countryCode: string): Promise<boolean> {
    try {
      // Mock API call to government database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Synced administrative data for ${countryCode}`);
      return true;
    } catch (error) {
      console.error('Failed to sync government data:', error);
      return false;
    }
  }

  // Search administrative units
  searchUnits(countryCode: string, query: string, level?: number): AdministrativeUnit[] {
    const hierarchy = this.hierarchies[countryCode];
    if (!hierarchy) return [];

    const searchTerm = query.toLowerCase();
    return hierarchy.units.filter(unit => {
      const matchesQuery = unit.name.toLowerCase().includes(searchTerm);
      const matchesLevel = level ? unit.level === level : true;
      return matchesQuery && matchesLevel;
    });
  }
}

export const governanceService = new GovernanceService();
export type { AdministrativeUnit, GovernanceHierarchy };