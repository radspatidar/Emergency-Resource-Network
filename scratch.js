async function test() {
  try {
    const res1 = await fetch('http://localhost:5001/api/emergencies');
    const emergencies = await res1.json();
    const pending = emergencies.find(e => e.status === 'Acknowledged' || e.status === 'Pending');
    if (!pending) {
      console.log('No pending/acknowledged emergencies found.');
      return;
    }
    console.log('Found emergency:', pending.id);

    const res2 = await fetch('http://localhost:5001/api/ambulances');
    const ambulances = await res2.json();
    const res3 = await fetch('http://localhost:5001/api/hospitals');
    const hospitalList = await res3.json();
    
    const amb = ambulances.find(a => a.status === 'Available' || a.status === 'AVAILABLE');
    const hosp = hospitalList[0];

    console.log('Assigning to:', hosp.id, amb.id);
    const assignRes = await fetch(`http://localhost:5001/api/emergencies/${pending.id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hospitalId: hosp.id,
        ambulanceId: amb.id,
        coordinatorName: 'Test'
      })
    });
    const text = await assignRes.text();
    console.log('Status:', assignRes.status, 'Response:', text);
  } catch (err) {
    console.error(err);
  }
}
test();
