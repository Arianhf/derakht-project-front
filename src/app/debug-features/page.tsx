'use client';

import { useEffect, useState } from 'react';
import { featureFlagService } from '@/services/featureFlagService';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';

export default function DebugFeaturesPage() {
  const [apiFlags, setApiFlags] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { flags, isFeatureEnabled } = useFeatureFlags();

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const result = await featureFlagService.getAllFlags();
        setApiFlags(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlags();
  }, []);

  const enableFeature = (featureName: string) => {
    localStorage.setItem(`feature_${featureName}`, 'true');
    window.location.reload();
  };

  const disableFeature = (featureName: string) => {
    localStorage.setItem(`feature_${featureName}`, 'false');
    window.location.reload();
  };

  const clearOverride = (featureName: string) => {
    localStorage.removeItem(`feature_${featureName}`);
    window.location.reload();
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Feature Flags Debug Page</h1>

      <div style={{ marginTop: '2rem' }}>
        <h2>Current Context Flags:</h2>
        <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          {JSON.stringify(flags, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>API Response:</h2>
        {error ? (
          <div style={{ color: 'red', background: '#ffe6e6', padding: '1rem', borderRadius: '4px' }}>
            Error: {error}
          </div>
        ) : (
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
            {JSON.stringify(apiFlags, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Story Creation Feature:</h2>
        <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          <p><strong>Status:</strong> {isFeatureEnabled('story_creation') ? '✅ Enabled' : '❌ Disabled'}</p>
          <p><strong>LocalStorage Override:</strong> {localStorage.getItem('feature_story_creation') || 'None'}</p>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => enableFeature('story_creation')}
              style={{
                padding: '0.5rem 1rem',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Enable Story Creation
            </button>
            <button
              onClick={() => disableFeature('story_creation')}
              style={{
                padding: '0.5rem 1rem',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Disable Story Creation
            </button>
            <button
              onClick={() => clearOverride('story_creation')}
              style={{
                padding: '0.5rem 1rem',
                background: '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Override
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>All Feature Flags:</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#333', color: 'white' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Feature Name</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>API Status</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Current Status</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>LocalStorage</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiFlags.map((flag) => (
              <tr key={flag.name} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '0.5rem' }}>{flag.name}</td>
                <td style={{ padding: '0.5rem' }}>{flag.enabled ? '✅' : '❌'}</td>
                <td style={{ padding: '0.5rem' }}>{isFeatureEnabled(flag.name) ? '✅' : '❌'}</td>
                <td style={{ padding: '0.5rem' }}>{localStorage.getItem(`feature_${flag.name}`) || '-'}</td>
                <td style={{ padding: '0.5rem' }}>
                  <button
                    onClick={() => enableFeature(flag.name)}
                    style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    Enable
                  </button>
                  <button
                    onClick={() => clearOverride(flag.name)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    Clear
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
