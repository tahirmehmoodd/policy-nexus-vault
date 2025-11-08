# Deployment Guide

## Prerequisites

- Supabase account and project
- Node.js 18+ and npm/bun
- Git for version control

## Environment Setup

1. **Supabase Configuration**
   - Project is already connected to Supabase
   - Project ID: `fqpflhvwxwkadzminjhj`
   - All migrations are automatically applied

2. **Database Extensions**
   - pgvector extension enabled for semantic search
   - Full-text search configured
   - Real-time enabled on relevant tables

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Database Setup

All database migrations are automatically applied. The following are already configured:

1. **Tables Created:**
   - policies
   - policy_sections
   - policy_texts
   - policy_versions
   - compliance_frameworks
   - tags
   - policy_tags
   - profiles
   - search_logs
   - policy_access_logs

2. **Extensions Enabled:**
   - pgvector for semantic search
   - Full-text search (tsvector)

3. **Functions Created:**
   - `search_policy_sections_keyword()`
   - `search_policy_sections_semantic()`
   - `update_policy_section_search_vector()`

4. **Real-time Enabled:**
   - policies table
   - policy_sections table

## Security Configuration

### Required Supabase Settings

1. **Email Authentication**
   - Navigate to: Authentication → Providers
   - Ensure Email provider is enabled
   - Configure email templates (optional)

2. **Password Security** (Recommended)
   - Authentication → Settings
   - Enable "Leaked password protection"
   - Set minimum password requirements

3. **URL Configuration**
   - Authentication → URL Configuration
   - Site URL: Your deployed URL
   - Redirect URLs: Add both preview and production URLs

### Optional Security Enhancements

1. **Multi-Factor Authentication**
   - Enable TOTP or other MFA methods
   - Configure in Authentication → Settings

2. **Email Verification**
   - Can be enabled/disabled for faster testing
   - Recommended for production

## Deployment

### Deploy to Lovable

1. Click "Publish" button in top right
2. Update when ready to deploy changes
3. Frontend deploys automatically
4. Backend (edge functions, migrations) deploy immediately

### Custom Domain (Optional)

1. Navigate to: Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Requires paid Lovable plan

## Post-Deployment

### 1. Test Authentication
- Try sign up flow
- Test sign in
- Verify forgot password works
- Check email delivery

### 2. Test Search
- Create a few test policies
- Try keyword search
- Verify real-time updates

### 3. Generate Embeddings (For Semantic Search)

To enable semantic search, you need to generate embeddings for policy sections. This can be done via:

1. **Edge Function** (Recommended)
   - Create an edge function to generate embeddings
   - Use OpenAI, Cohere, or other embedding API
   - Process sections in batches

2. **Manual Script**
   - Export sections from database
   - Generate embeddings using your preferred service
   - Update sections with embedding vectors

Example structure for embedding generation:
```typescript
// Pseudo-code
const sections = await getAllSections();
for (const section of sections) {
  const embedding = await generateEmbedding(section.content);
  await updateSection(section.id, { embedding });
}
```

### 4. Populate Compliance Frameworks

Insert compliance framework data into `compliance_frameworks` table:

```sql
INSERT INTO compliance_frameworks 
  (framework_name, framework_category, control_id, control_description, keywords)
VALUES
  ('ISO 27002', 'Access Control', 'A.9.1', 'Access control policy', 
   ARRAY['access', 'authentication', 'authorization']),
  -- Add more frameworks...
```

## Monitoring

### Database Performance
- Monitor query performance in Supabase dashboard
- Check index usage
- Review slow query logs

### Application Logs
- Edge function logs: Supabase → Functions → Logs
- Database logs: Supabase → Database → Logs
- Authentication logs: Supabase → Authentication → Logs

## Backup & Recovery

### Automated Backups
- Supabase automatically backs up your database
- Configure retention in project settings

### Manual Backup
```bash
# Export policies
supabase db dump --schema public > backup.sql
```

## Troubleshooting

### Common Issues

1. **"Tried to subscribe multiple times" Error**
   - Fixed by using unique channel names with crypto.randomUUID()
   - Proper cleanup in useEffect

2. **Search Not Working**
   - Verify pgvector extension is installed
   - Check if search functions exist
   - Ensure indexes are created

3. **Real-time Not Updating**
   - Verify REPLICA IDENTITY is set
   - Check supabase_realtime publication
   - Ensure proper subscription setup

4. **Authentication Issues**
   - Check Site URL and Redirect URLs in Supabase
   - Verify email provider is enabled
   - Check email templates if emails not arriving

## Performance Tips

1. **Database Optimization**
   - Keep indexes on frequently queried columns
   - Use connection pooling
   - Monitor query performance

2. **Frontend Optimization**
   - Lazy load components
   - Implement pagination
   - Cache search results

3. **Search Performance**
   - Use appropriate match_count limits
   - Implement debouncing for search inputs
   - Consider caching frequent queries

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [pgvector Guide](https://github.com/pgvector/pgvector)
- [Lovable Documentation](https://docs.lovable.dev)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)

## Next Steps

1. Generate embeddings for semantic search
2. Populate compliance frameworks
3. Set up user roles (Admin, Editor, Reviewer, Viewer)
4. Configure email templates
5. Set up analytics and monitoring
6. Train users on the system
