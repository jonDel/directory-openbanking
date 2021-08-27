export {
  phaseOneData,
  phaseTwoData,
  phaseThreeData,
  directoryApiUrl
}


const directoryApiUrl = 'https://us-central1-directory-openbanking.cloudfunctions.net/datadirectoryproxy'
const phaseOneData = {
  title: 'Marcas participantes da primeira fase do OpenBanking'
  ,
  columns: [
    {
      name: 'CustomerFriendlyName',
      required: true,
      label: 'Nome da marca/AS',
      align: 'left',
      field: row => row.CustomerFriendlyName,
      format: val => `${val}`,
      sortable: true
    },
  ],
  familyTypesCombs: [
    ['discovery', 'channels', 'products-services', 'admin']
  ],
  familyTypes: ['discovery', 'channels', 'products-services', 'admin'],
  orgDomainRoleClaims: ['DADOS']
}
const phaseTwoData = {
  title: 'Marcas participantes da segunda fase do OpenBanking'
  ,
  columns: [
    {
      name: 'CustomerFriendlyName',
      required: true,
      label: 'Nome da marca/AS',
      align: 'left',
      field: row => row.CustomerFriendlyName,
      format: val => `${val}`,
      sortable: true
    },
  ],
  familyTypesCombs: [
    ['consents', 'resources', 'customers-business', 'customers-personal'],
    ['consents', 'resources', 'customers-business'],
    ['consents', 'resources', 'customers-personal']
  ],
  familyTypes: ['consents', 'resources', 'customers-business', 'customers-personal'],
  orgDomainRoleClaims: ['DADOS']
}
const phaseThreeData = {
  title: 'Marcas participantes da terceira fase do OpenBanking'
  ,
  columns: [
    {
      name: 'CustomerFriendlyName',
      required: true,
      label: 'Nome da marca/AS',
      align: 'left',
      field: row => row.CustomerFriendlyName,
      format: val => `${val}`,
      sortable: true
    },
  ],
  familyTypesCombs: [
    ['payment-consents', 'payments-pix']
  ],
  familyTypes: ['payment-consents', 'payments-pix'],
  orgDomainRoleClaims: ['PAGTO']
}


export function filterData(data) {
  let phaseOneAuthServers = []
  let phaseTwoAuthServers = []
  let phaseThreeAuthServers = []
  for (const org of data) {
    let hasDataActive = false
    for (const role of org.OrgDomainRoleClaims) {
      if (role.Role === 'DADOS' && role.Status === 'Active') {
        hasDataActive = true
        break
      }
    }
    if (!hasDataActive) {continue}
    for (const authServer of org.AuthorisationServers) {
      let phases = getPhase(authServer.ApiResources)
      let authData = {}
      authData['CustomerFriendlyName'] = authServer.CustomerFriendlyName
      authData['CustomerFriendlyDescription'] = authServer.CustomerFriendlyDescription
      authData['CustomerFriendlyLogoUri'] = authServer.CustomerFriendlyLogoUri
      authData['OpenIDDiscoveryDocument'] = authServer.OpenIDDiscoveryDocument
      authData['AuthorisationServerId'] = authServer.AuthorisationServerId
      if (phases.phaseOne) {
        let authDataPhaseOne = JSON.parse(JSON.stringify(authData))
        authDataPhaseOne["ApiResources"] = authServer.ApiResources.filter(
          resource => phaseOneData.familyTypes.includes(resource.ApiFamilyType)
        )
        phaseOneAuthServers.push(authDataPhaseOne)
      }
      if (phases.phaseTwo) {
        let authDataPhaseTwo = JSON.parse(JSON.stringify(authData))
        authDataPhaseTwo["ApiResources"] = authServer.ApiResources.filter(
          resource => phaseTwoData.familyTypes.includes(resource.ApiFamilyType)
        )
        phaseTwoAuthServers.push(authDataPhaseTwo)
      }
      if (phases.phaseThree) {
        let authDataPhaseThree = JSON.parse(JSON.stringify(authData))
        authDataPhaseThree["ApiResources"] = authServer.ApiResources.filter(
          resource => phaseThreeData.familyTypes.includes(resource.ApiFamilyType)
        )
        phaseThreeAuthServers.push(authDataPhaseThree)
      }
    }
  }
  return {
    phaseOneAuthServers: phaseOneAuthServers.sort((a, b) => a.CustomerFriendlyName > b.CustomerFriendlyName && 1 || -1),
    phaseTwoAuthServers: phaseTwoAuthServers.sort((a, b) => a.CustomerFriendlyName > b.CustomerFriendlyName && 1 || -1),
    phaseThreeAuthServers: phaseThreeAuthServers.sort((a, b) => a.CustomerFriendlyName > b.CustomerFriendlyName && 1 || -1),
  }
}


function getPhase(apiResources) {
  let phases = {
    phaseOne: false,
    phaseTwo: false,
    phaseThree: false,
  }
  let familyTypes = apiResources.map(x => x.ApiFamilyType)
  if (checkIfFamilyInPhase(phaseOneData.familyTypesCombs, familyTypes)) {
    phases.phaseOne = true
  }
  if (checkIfFamilyInPhase(phaseTwoData.familyTypesCombs, familyTypes)) {
    phases.phaseTwo = true
  }
  if (checkIfFamilyInPhase(phaseThreeData.familyTypesCombs, familyTypes)) {
    phases.phaseThree = true
  }
  return phases
}


function checkIfFamilyInPhase(familyPhaseComb, family) {
  let isSubset = false
  for (const familyPhase of familyPhaseComb) {
    if (checkIfSubset(family, familyPhase)) {
      isSubset = true
      break
    }
  }
  return isSubset
}


function checkIfSubset(baseArray, subArray) {
  var check = subArray.every((el) => {
    return baseArray.indexOf(el) !== -1;
  });
  return check
}