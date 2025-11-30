import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { issueCertificateHandler, listCertificatesHandler } from './certificates.controller';
import { validateCertificatePayload } from './certificates.validation';

const router: Router = Router();

router.get('/', listCertificatesHandler);
router.post('/', validateRequest(validateCertificatePayload), issueCertificateHandler);

export default router;
